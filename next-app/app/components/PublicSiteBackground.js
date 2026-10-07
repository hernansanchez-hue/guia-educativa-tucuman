"use client";

import { usePathname } from "next/navigation";

const BACKGROUND_LINES = [
  { d: "M-90 138C136 98 264 264 468 346C588 394 670 432 804 486", color: "#0d1b3d", dash: "13 100", duration: "10s", delay: "-2s", opacity: 0.28, width: 1.7 },
  { d: "M-72 356C156 286 300 384 476 468C590 522 708 558 862 620", color: "#4f83cc", dash: "9 100", duration: "12s", delay: "-8s", opacity: 0.25, width: 1.45 },
  { d: "M-52 724C156 610 294 568 458 540C614 514 752 528 938 600", color: "#c9971a", dash: "11 100", duration: "9s", delay: "-5s", opacity: 0.28, width: 1.9 },
  { d: "M-60 918C168 742 352 734 502 666C612 616 682 568 790 494", color: "#2e9270", dash: "7 100", duration: "11s", delay: "-10s", opacity: 0.23, width: 1.35 },
  { d: "M286 -84C358 114 466 284 594 402C662 464 720 498 816 550", color: "#7560a8", dash: "10 100", duration: "13s", delay: "-4s", opacity: 0.23, width: 1.6 },
  { d: "M578 -84C600 110 656 276 746 412C806 502 916 572 1054 666", color: "#5879b9", dash: "14 100", duration: "11s", delay: "-7s", opacity: 0.25, width: 1.75 },
  { d: "M1032 -76C968 130 916 282 868 416C832 516 860 654 1014 790", color: "#c9971a", dash: "8 100", duration: "10s", delay: "-1s", opacity: 0.24, width: 1.45 },
  { d: "M1504 88C1268 120 1146 252 1026 350C934 426 858 466 740 510", color: "#0d1b3d", dash: "12 100", duration: "13s", delay: "-11s", opacity: 0.29, width: 1.8 },
  { d: "M1510 318C1298 356 1152 412 1020 486C912 544 842 626 756 726", color: "#4f83cc", dash: "9 100", duration: "9s", delay: "-6s", opacity: 0.25, width: 1.4 },
  { d: "M1502 614C1308 596 1152 570 1006 600C892 622 782 700 658 804", color: "#2e9270", dash: "11 100", duration: "12s", delay: "-9s", opacity: 0.24, width: 1.65 },
  { d: "M1490 902C1268 770 1120 712 974 680C850 654 700 672 574 744", color: "#7560a8", dash: "7 100", duration: "10s", delay: "-3s", opacity: 0.22, width: 1.3 },
  { d: "M1380 1086C1190 880 1048 796 930 698C838 620 766 542 648 464", color: "#c9971a", dash: "13 100", duration: "12s", delay: "-12s", opacity: 0.27, width: 1.8 },
  { d: "M130 1080C278 856 406 760 538 672C638 604 724 534 844 396", color: "#5879b9", dash: "8 100", duration: "11s", delay: "-7s", opacity: 0.23, width: 1.45 },
  { d: "M-44 560C172 520 310 500 468 466C594 440 694 366 814 230", color: "#0d1b3d", dash: "10 100", duration: "13s", delay: "-13s", opacity: 0.22, width: 1.55 },
  { d: "M148 1060C254 870 344 782 472 716C582 658 690 606 796 514", color: "#2e9270", dash: "7 100", duration: "9s", delay: "-4s", opacity: 0.22, width: 1.3 },
  { d: "M1498 1020C1284 890 1174 810 1050 740C920 666 800 592 682 454", color: "#4f83cc", dash: "12 100", duration: "12s", delay: "-10s", opacity: 0.24, width: 1.7 },
];

export default function PublicSiteBackground({ children }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <div className="public-site-root">{children}</div>;
  }

  return (
    <div className="public-site-background">
      <svg
        aria-hidden="true"
        className="public-site-background-lines"
        focusable="false"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 1000"
      >
        {BACKGROUND_LINES.map((line, index) => (
          <path
            className="public-site-background-line"
            d={line.d}
            key={index}
            pathLength="100"
            style={{
              "--line-color": line.color,
              "--line-dash": line.dash,
              "--line-delay": line.delay,
              "--line-duration": line.duration,
              "--line-opacity": line.opacity,
              "--line-width": line.width,
            }}
          />
        ))}
      </svg>
      <div className="public-site-background-content">{children}</div>
    </div>
  );
}
