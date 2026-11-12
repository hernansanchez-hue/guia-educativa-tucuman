"""Read-only PDF extraction. Keeps all pages and original column text as provenance."""
import argparse
import hashlib
import json
import re
from pathlib import Path
import pdfplumber

parser = argparse.ArgumentParser()
parser.add_argument("pdf")
parser.add_argument("output")
args = parser.parse_args()
source = Path(args.pdf)
target = Path(args.output)
target.mkdir(parents=True, exist_ok=True)

def column(page, x0, x1, top, bottom):
    return page.crop((x0, top, x1, bottom)).extract_text(x_tolerance=1.5) or ""

def field(text, label, following):
    match = re.search(label + r"\s*(.*?)(?=" + following + r"|\Z)", text, re.S)
    return re.sub(r"\s+", " ", match[1]).strip() if match else ""

records = []
pages = []
university_offers = []
university_profiles = []
department = None
with pdfplumber.open(source) as pdf:
    for number, page in enumerate(pdf.pages, 1):
        pages.append({"page": number, "text": page.extract_text(), "layout": page.extract_text(layout=True)})
        if number in (2, 3):
            university_profiles.append({"page": number, "text": column(page, 60, 296, 95 if number == 2 else 45, 800), "offer": column(page, 297, 555, 95 if number == 2 else 45, 800)})
        if number in (4, 5):
            for x0, x1 in ((60, 297), (300, 555)):
                words = page.extract_words()
                starts = [w["top"] for w in words if w["text"] == "-" and x0 < w["x0"] < x0 + 10 and w["top"] > 90]
                for index, start in enumerate(starts):
                    end = starts[index + 1] - 1 if index + 1 < len(starts) else 795
                    text = column(page, x0, x1, start - .5, end)
                    university_offers.append({"page": number, "university": "UNT" if number == 4 else "UNSTA", "name": re.sub(r"\s+", " ", text).removeprefix("- ").strip()})
        if not 6 <= number <= 29:
            continue
        words = page.extract_words(extra_attrs=["size", "fontname"])
        starts = [word["top"] for word in words if word["text"] == "Carreras" and word["x0"] > 360]
        for index, start in enumerate(starts):
            end = starts[index + 1] - 2 if index + 1 < len(starts) else 800
            headings = [w for w in words if w["x0"] < 200 and w["top"] < start and w["top"] > 40 and w["size"] > 12]
            if headings:
                heading_y = headings[-1]["top"]
                department = " ".join(w["text"] for w in headings if abs(w["top"] - heading_y) < 1)
            left = column(page, 60, 208, start - 1, end)
            middle = column(page, 210, 366, start - 1, end)
            right = column(page, 369, 555, start - 1, end)
            cue = re.search(r"CUE-anexo:\s*(\d{9})", left)
            name = re.split(r"\n(?:Estatal|Privado)", left)[0].replace("\n", " ").strip()
            offers = right.split("Enfoque GET:")[0].split("Carreras / propuesta publicada:")[-1].strip()
            careers = [re.sub(r"\s+", " ", value).strip() for value in re.split(r"(?:^|\n)-\s*", offers)[1:]]
            records.append({
                "sourceId": cue[1] if cue else f"page-{number}-{index}", "page": number,
                "department": department, "name": name,
                "ownership": "Privado" if re.search(r"\nPrivado", left) else "Estatal",
                "locality": field(middle, "Localidad:", "C.digo postal:"),
                "address": field(middle, "Direcci.n:", "Localidad:"),
                "postalCode": field(middle, "C.digo postal:", "Tel.fono:"),
                "phone": field(middle, "Tel.fono:", "Correo:"),
                "email": field(middle, "Correo:", "Web:"),
                "website": field(middle, "Web:", r"(?!)"),
                "offerType": field(left, "Oferta registrada:", "Tipo INFoD:"),
                "infodType": field(left, "Tipo INFoD:", r"(?!)"),
                "careers": careers, "offerText": offers,
                "originalColumns": {"identity": left, "contact": middle, "offer": right}
            })
result = {"source": source.name, "sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "pageCount": len(pages), "pages": pages, "tertiaryCampuses": records, "universityProfiles": university_profiles, "universityOffers": university_offers}
(target / "GET-PDF-EXTRACTION.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
(target / "GET-PDF-EXTRACTION.txt").write_text("\n\n".join(f"=== PAGE {p['page']} ===\n{p['layout']}" for p in pages), encoding="utf-8")
print(json.dumps({"pages": len(pages), "campuses": len(records), "uniqueCues": len({r['sourceId'] for r in records}), "localities": sorted({r['locality'] for r in records}), "careerMentions": sum(len(r['careers']) for r in records)}, ensure_ascii=False))
