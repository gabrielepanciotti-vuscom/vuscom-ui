// src/AppSidebar.jsx
import { useEffect as useEffect2, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// src/brand/Brand.jsx
import { useEffect } from "react";

// src/brand/logo-v-chiaro.png
var logo_v_chiaro_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAACACAMAAADtR70aAAABgFBMVEXaViz6pR/fdVi2K1e9tcrgrsdxJ3ePapyWgqjegXPgnab+wDv+y1/+/v706O786c/r1+fWp8zNhrbXttTqxtOvRZbjuNLQl8WpN5HRZm2yWaTsuLHz19X95LO1Z6vGebTXxdrHV3Czda/al7L72Kq1OHfmyeGmKYm3VZjQdI3kqa/81pPCS2rZdW/Zho70x7D+8drPV1X0uI/5yJOaGISXJojBWovXZVLJaY7qlnDqppO9RnTCaqn4uneUNou5i7nISVPLi8Did1LkiXD8yXTek5rc0+HkmI3wonH+0nWTB3utJmzphlP2p1igG4S4mL34pC2MV5SxS6Ddpb3oZxTodTT0iBH0ljjzm1b6t1RwHnOFEXmXRJGbcaOmHHTveBoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACJq1YlAAAAYHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9ebwvOAAAFW0lEQVR42u2aV3PjNhSF7S3p96KwF7GI6r13ufe6vWTb//8XAS3a2ZmUWTsCk8mQDxSgB308BxeHAEYb8C9cGxk0g2bQDJpBM2gGzaAZNIP+j6AKpg3V4xtV0lbK9LTtNai4IQcI0oIKiQiKD/GY0rSgCNwARPAwPXsjCpRSLYYf0VSgLkAJmR376ilpFRKFyADK0KRCKAapQHUKOiuZcTJcb6cyZUTd6C5biKmCmqgkCkcpQF3QddAX1CwBU4J8KtnrIrzkakVMFT3v/WksSIDWVJUDNRV7FxSO+RTeMi64Ljwt6gsFbD+eMkoqr7Zo4voUy75vA/XwGuVDaw7WQD3nvg++MBj/8mW6Nqgbz5baY51HaGqGTUErBVT+yqFmYaSq5xVuozFQ8oEIX8lQpw2qqz/m0YRWBoZIXNsAlL1Gcl1nR61xtWgaNtPPdhUlTiOZUAfbM3B+0osjVmGLM5/vwnZe/mrQaTk7kT56qX3mC780sGkgdwlKYDpzj0G1onmRVXx+ZjOOynPZ614CTvfQmqhzv/J5sfuipA3/djjXAD1xnX08dtTGpFHkC40PzJJRwvyaoOQP33SS8ZzWdqxqozYZjc41pjH/A655W5HrxPhO8gw97J3gjDiWGoZhccJNvzwoidnCcF1KCeTI18ILca/XczaaVrfaaPHiqFw2bK58UGH9Sk87cBA/AiH9d+BA+9jtHlYbo6JmmJ59xlDBNdpLoF6HQmfVJHVYAmk7G8djq9q1wjAqVswrLpL+I1vnVrGffJ5C4SD2dklOkMza45ZlVefhvMgrmn/mAUVYq71C3s+52Ns6XPb7fXg93Z+p45oVVueCqF3ZJU9l22vcFBN4D7n6zbBCoSBkt9/2emRvY9zdCcPGvChqt8xNEwAB1l1Ip/XcJnm/LLxZXrq9V+19p9mMGtFoxItauUwZAwbrVNohhGzCaS5WSsiSbF6cTPe7s6ZlNeZzgTRsmw/xWx/+W5XWcyIUOjnyrP7s2eWb3rv+3sVsbHXDRmNyPtLK5oCLUMD1QuMoOM3Vc52c0Fx4e/JlerHXFKVLXZXqqGu6yWWcrvwSm5tcl+2L6d4j4e1hstW/0kwqAdq5ycL6qtN79XoFTTLP5IYUKJAc2byFkt7Fo3HTClvJ7nDgeYaUw6tcLs6/xOGTjemPY2unlhzdXBkvPFknZgcH/ferVntv3LWscFWtaA4UBeVAReTm7iJ4v9nqhtVEqG+Kt7e0s8E6ebNMoEKolbj7QpTufcroXoEvkoEsC6uO2m2Gibu6aWhqnkpTKhYMl8ngWc1GtGp5ZbF/AUlKBfLtwfKLu+oc7jSS40ZusgoNUBpUhGGbrH5enUxWDWM4ZIY8pQCFfuHVdLZq39autqsxL5AKFevOBBqtIlAZ2FsKSlQa//S0vefcdeLaHfq2wRSJSsk7fO3sH399EKgN8tsMQCL05nTBqX3V3dVsO++hzDGFNoxnzR3n9y9M28vjkVylJFbqqHd1Q82tyhZ7LtvemnvYat1JNbwK3QaQC0U4jqHVW6HDrWH+1+AJSlYqsshVb6FMrOpFEaFse1sYtqrnSexqQqfyvQIgXSmC+pJGyHV9VyjdpgqVDlWhqvIqM1nZ80y2pXwK7j9j7g1FcJBFYnmiLfKa8VH5pBwFKdjrwlOVcvD1IA/biPc39yFQDqPIKOvDfH4YfKdc/wDyq3dlMZZARVThITIfAhWoSomVcctQtuB5gE9SsfeGTOPTBXp/Yx8O1YEaYFC8hgBTg9LYY7GRUOAoPaX/+HogNB7Qh9Zu9o+ODJpBM2gGzaAZNINm0AyaQTNoBs2g/w3ob1eoVDp/xnNEAAAAAElFTkSuQmCC";

// src/brand/logo-v-scuro.png
var logo_v_scuro_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAACACAMAAADtR70aAAABgFBMVEXfnZv40qP3mCKXZW3gayrTmFCcZjywcqD239mgK3yijVy8j7bjX1PQkMQzP19+Hn5vdprIO2/CZrD/wl4bOmkrOmz+/f4wSG9ONnVqNXqQK4hNQ2h0MYFsRmqzR3OsKY/MWGdvZ1XPZVJPVVx0VVKKMYSMRm2zVWaOWFOuNYVJTFqSOXmNaUixY0rGSnF6LoOuW1WUeUy4lkjKWlhGU2CYHYasPHzmak/w5uvzeTFsJHqTUWSwQ5u0aTWzi0nPu8rpu9NdYFx0UWWWaaLXdy/+yjTrxc88RVpXJ3R5cVa2TFy3czTSd5DNmrDvkyft2bvv3OlrTlSMcKKkHYnENofOQIDNbjjSZm3VjS/SmDvVo8nWwdDX0MXT2ePb5fHkVmwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACX+DKbAAAAYHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9ebwvOAAAFX0lEQVR42u2aV3vTSBSGnRA6bJ2zc2akUW+25Zbi9B4CIfSlw8L//xd7RnKA3QeMZSRxIz258OTCr7/vlDkzdov9hKfVQBtoA22gDbSBNtAG2kAbaDUP/Awowte51UFRAwHrVor4DYMrggIIba0WCnVBs2CimQFrgwITgtQyUaO92loAqeEAtUDJWgSUU4RWAM2tRZCZ3Hrq1CChiDKTi7V0JBJmIHYZmCBRr+pIJIMpZNjVRKRSraXhk7UqwhDYAIX59cQtGUoMZaBi0EYpKK6ANWxtBhjkroUhMmlSN6pDqRZqYQTQNk2pMwmheqWRAsXwhaAiHUg0YYrQkqAGAGfKQSGgLalISegUZklQYFEMlEYvuiIEtFFMFfrjUP3egWIGVx8j0YXQxgEyExlUOphx6kKG+mhQhY7bQiLaAqcLLQEacJVQT1B9C8do2iZlEopKR1Cu/VVD5SjDUuPnYjAAezBVZSnQYWIkYMRRvy+6QtiSkghEuVD+hQiqEq6r5Wh927EMKxo/D4UEKb8rtAA043H+H5m9TtDj28pwLIuEhiQUMBsES4F2+IVI+FImsGB4tB7HjrKsbjtEMteG779ba+ZqJJHuKlt12Spnvv5fypMeT7iKM6Fd0TZtG0DvpCVBOz5zfa0t1+ezoEOvkyS4NVxxYieKSKhNWxrOInRWaB7Ls1W2vMqXOX2EDg92IWAqMZzI6lvWWLRDaaMOKZQD5drQ0YiNVnVkfeanPGWdINgcel7sxJaltFCBAwixtPMpJc1I+8o5yXT3wOXsvLPLjUR5Q4dK1LLaIpQD22QApUGzYB6O2J0zvgzuiL1O04Bt9nqJ4SkKaF+N222qlsG3h845oNCBN9zVYrnLXZenEJwECffWPc9xYi20K2xTyhmFzlwy2lx2+YZ7x3+z5y6m551kM+g9HcYR5ZElSKgNU2exOaA+9/3DO3zZBZdKp5PeXTxJer31hLLI0UJpS5MztYVibXDk6qx1O4vpo9fnj5KXwUsv8Vac+9SJxt3rJNTU43W5UN2Clt0bC+8X3j9+vHCyu9nz6Ilf7b87fXe6/1bqUbf0Kx3gl7W5H/7KnstPTwg69O638vXbNdpbyodyarj88O5CDllY0krJ3NN8vbOFlUDh0KXM3csh15KsWlYu5cuDv0MTWflQBmc6kzqPJ/4u9YZefOthvjpeQ2lWAdXb597elT9zTGtp3VuJnSfZYsO2EaEKKNNd12XpRsb50KNGbz3IP8HDe5S8WA2U/lJ/cZJKrRXHsSa5u6PHomqUUmfwF/0raQ46JXOdXPXBmp5SKoLSpmqwYHc/p76K+1fzV3+smYNCyEIjqM8ejdKlSZm0+v2DPI1MfTCsyl7QMwoP7l7LSzWKc3dvrxXN3YLDdpAGi1cm6eNMcnfnXlgwooWgNOQGPPnlwt/9i24kESpUyoFDLxjmVbOxMelGplmtvTSMbSbDib/Z80TSEIiMVQjNbheOLv3zGXr715AOpFXayyCAdZoXHn6G7gzMwsiiSqk/gFJHn5j7MjRDFNVCKYGN7bh7cAE93gph+p1GKUoTY3s7evApjWgIDKGwv0UTSV+lGNEklW5u0QEYqo4pgxjoXPj7zYtNTYSFi3Suiw4OKIyrv1199uwYzdmOhj+q1GCWvqa6fm9ta0tiCN/6Dq/kmCoQAts0ilGx6A4IddiL+tZaAPHEfOYWt5dBBPqSCm1TSH3DitVDL8j6axeYJ5zzQUkalYkNEjFkOB93bqVQp1KdSvkVFSADqA2afQOcx7Q+KGPz+vrjMZ2f3PyMpIE20AbaQBtoA22gDbSBNtAG2kAb6P+h/Cc8/wJv980MNNB3ggAAAABJRU5ErkJggg==";

// src/brand/marchio-chiaro.png
var marchio_chiaro_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAACxCAMAAACC95SQAAABgFBMVEXyoGH3lxuZVZmTF3awlbnYZFHoqJ1vGnLCY5rjYCHSlcIGGU39yVz6xZCsqsCZDYF0Toc/XoB8N4HEPkr+wThgTH+/UH3+/v4UO2UCK1kIMV3u6O2Gma4nSnA2VnpKZ4fr1+aqtsWmKIyXp7nIVmr86NC5xNCsN43W2+KwRpTUp8vJyte7RXZadJGYGIXQWVTYZVHpx9R1i6Nje5ccQWnWt9TM09y1OHNsg5yUJ4jOl8Xc4ef12M/Mh7XjuM6yWKT717HCSmrXl7G1ZqrGeLGzd6/QZm/947NBXoB9kajqtrHmy+H915DYh5OhHIjjpqusKHfYdnDkl4r1xq/+8dmyVZXjaDLpdDOUNoz8x3DHZ43xdhT6qCrtqI79uS/Qdo0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABfHEnzAAAAYHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9ebwvOAAAXGUlEQVR42u2dB0PizLqAAwiibvm+c869k2TSKSEBQu9NAd2197Wv//9f3HcSSoCAoLt77qfzbhFTcHjy9plEBlF5kzAUAQVIAVKAFCAVCpACpAApQCoUIAVIAVKAVP5/A9xUKMA3SfiQAnylHJrDV4ZJAb5CFIINk1c5TAG+UuoWRtSEX6mABB0uwYsWpgBXpqcgrTd4nayROPIlQQEuLbbGHUL+0muNtq2VKMCl1e96FH51oPmuvOAf00BTH6Yu1zVMAb4m/IL12lZr7gJRhQJcXvr3Ay2sBzqDTSU/BbgCQAOjUp34wl4d4d0SQtSEl5XuwN1hLVAfBJR1PwW4AkAF4W6OuED/IWhi28kI0ZcSBbg8w4COnUTQCOwOUsJSkgJcKv9r2y6whdqan4RdE6O19TqthZeW40DOSVjMr1/byCzZ4dekAJfPnzcxuj7rw6u2iUoBa8hujTYTXvZ8bTR0fDpqh0EN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";

// src/brand/marchio-scuro.png
var marchio_scuro_default = "data:image/png;base64,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";

// src/brand/Brand.jsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var LOGHI_VUSCOM = Object.freeze({
  vChiaro: logo_v_chiaro_default,
  vScuro: logo_v_scuro_default,
  marchioChiaro: marchio_chiaro_default,
  marchioScuro: marchio_scuro_default,
  favicon: logo_v_scuro_default
});
function LogoV({ size = 34, className = "" }) {
  const style = { width: size, height: size };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("img", { src: logo_v_chiaro_default, alt: "VUS COM", style, className: `block object-contain dark:hidden ${className}` }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: logo_v_scuro_default,
        alt: "VUS COM",
        style,
        className: `hidden rounded-[9px] object-contain dark:block ${className}`
      }
    )
  ] });
}
function MarchioVuscom({ className = "h-12 w-auto" }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("img", { src: marchio_chiaro_default, alt: "VUS COM", className: `${className} dark:hidden` }),
    /* @__PURE__ */ jsx("img", { src: marchio_scuro_default, alt: "VUS COM", className: `${className} hidden dark:block` })
  ] });
}
function useFaviconVuscom() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/png";
    link.href = LOGHI_VUSCOM.favicon;
  }, []);
}

// src/AppSidebar.jsx
import {
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings
} from "lucide-react";
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function AppSidebar({
  appName = "App",
  appSubtitle = "",
  appIcon,
  mainTree = [],
  adminTree = [],
  expandedGroups,
  onToggleGroup,
  user,
  onOpenProfile,
  onLogout,
  userMenuExtras = [],
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
  themeSlot,
  footerSlot,
  navClassName = ""
}) {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  useEffect2(() => {
    function handleClickOutside(e) {
      if (!e.target.closest?.("[data-user-menu]")) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const isActive = (item) => {
    if (!item?.to) return false;
    if (item.matchPrefix) {
      return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
    }
    return location.pathname === item.to;
  };
  const isGroupActive = (group) => (group.children || []).some(
    (c) => c.children ? isGroupActive(c) : isActive(c)
  );
  const renderLeaf = (item, isCollapsed, indent = false) => {
    const active = isActive(item);
    const Icon = item.icon;
    return /* @__PURE__ */ jsxs2(
      Link,
      {
        to: item.to,
        onClick: onClose,
        className: `group relative flex items-center gap-2.5 py-2 rounded-[7px] mb-0.5 text-[13px] transition-colors border-l-[3px] ${isCollapsed ? "justify-center px-2.5" : indent ? "pl-7 pr-2.5" : "px-2.5"} ${active ? "border-accento bg-brand-50 dark:bg-brand-500/[0.12] text-brand-700 dark:text-brand-300 font-semibold" : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`,
        children: [
          Icon && /* @__PURE__ */ jsx2(
            Icon,
            {
              className: `w-4 h-4 flex-shrink-0 ${active ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-600"}`
            }
          ),
          !isCollapsed && /* @__PURE__ */ jsx2("span", { className: "truncate", children: item.label }),
          isCollapsed && /* @__PURE__ */ jsx2("span", { className: "pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-md bg-slate-900 dark:bg-slate-700 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg", children: item.label })
        ]
      },
      item.id || item.to
    );
  };
  const renderGroup = (group, isCollapsed) => {
    const Icon = group.icon;
    const groupId = group.id || group.label;
    const expanded = expandedGroups?.has(groupId);
    const groupActive = isGroupActive(group);
    if (isCollapsed) {
      const isHover = hoveredGroup === groupId;
      return /* @__PURE__ */ jsxs2(
        "div",
        {
          className: "relative",
          onMouseEnter: () => setHoveredGroup(groupId),
          onMouseLeave: () => setHoveredGroup(null),
          children: [
            /* @__PURE__ */ jsx2(
              "button",
              {
                type: "button",
                className: `group relative flex items-center justify-center gap-2.5 px-2.5 py-2 rounded-[7px] mb-0.5 text-[13px] border-l-[3px] w-full transition-colors ${groupActive ? "border-accento bg-brand-50 dark:bg-brand-500/[0.12] text-brand-700 dark:text-brand-300" : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`,
                onClick: () => onToggleGroup?.(groupId),
                title: group.label,
                children: Icon && /* @__PURE__ */ jsx2(
                  Icon,
                  {
                    className: `w-4 h-4 ${groupActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-600"}`
                  }
                )
              }
            ),
            isHover && /* @__PURE__ */ jsxs2("div", { className: "absolute left-full top-0 ml-2 z-50 min-w-[200px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1.5 px-1.5", children: [
              /* @__PURE__ */ jsx2("div", { className: "px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500", children: group.label }),
              group.children.map((child) => renderLeaf(child, false, false))
            ] })
          ]
        },
        groupId
      );
    }
    return /* @__PURE__ */ jsxs2("div", { className: "mb-0.5", children: [
      /* @__PURE__ */ jsxs2(
        "button",
        {
          type: "button",
          onClick: () => onToggleGroup?.(groupId),
          "aria-expanded": !!expanded,
          className: `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] transition-colors border-l-[3px] border-transparent ${groupActive ? "text-slate-900 dark:text-slate-100 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]"}`,
          children: [
            Icon && /* @__PURE__ */ jsx2(
              Icon,
              {
                className: `w-4 h-4 flex-shrink-0 ${groupActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-600"}`
              }
            ),
            /* @__PURE__ */ jsx2("span", { className: "flex-1 text-left truncate", children: group.label }),
            /* @__PURE__ */ jsx2(
              ChevronRight,
              {
                className: `w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`
              }
            )
          ]
        }
      ),
      expanded && /* @__PURE__ */ jsx2("div", { className: "mt-0.5", children: group.children.map((child) => renderLeaf(child, false, true)) })
    ] }, groupId);
  };
  const renderItem = (item, isCollapsed) => item.children ? renderGroup(item, isCollapsed) : renderLeaf(item, isCollapsed, false);
  const buildSidebar = (isCollapsed, showCollapseButton) => /* @__PURE__ */ jsxs2(
    "div",
    {
      className: `flex flex-col h-full bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 border-r border-gray-200 dark:border-white/[0.06] shadow-[2px_0_12px_rgba(0,0,0,0.04)] dark:shadow-none transition-[width] duration-200 ease-out ${isCollapsed ? "w-[60px]" : "w-60"}`,
      children: [
        /* @__PURE__ */ jsxs2(
          "div",
          {
            className: `flex items-center border-b border-gray-100 dark:border-white/[0.06] ${isCollapsed ? "flex-col gap-2 py-3 px-2" : "gap-2.5 px-4 pt-5 pb-4"}`,
            children: [
              /* @__PURE__ */ jsx2("div", { className: "flex-shrink-0", children: appIcon ?? /* @__PURE__ */ jsx2(LogoV, {}) }),
              !isCollapsed && /* @__PURE__ */ jsxs2("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx2("div", { className: "text-slate-900 dark:text-slate-100 text-[13px] font-bold leading-tight truncate", children: appName }),
                appSubtitle && /* @__PURE__ */ jsx2("div", { className: "text-slate-400 dark:text-slate-500 text-[10px] tracking-wide truncate", children: appSubtitle })
              ] }),
              showCollapseButton && onToggleCollapse && /* @__PURE__ */ jsx2(
                "button",
                {
                  onClick: onToggleCollapse,
                  "aria-label": isCollapsed ? "Espandi menu" : "Comprimi menu",
                  className: isCollapsed ? "flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-md ring-2 ring-primary/25 hover:brightness-110 hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-4 transition-all" : "flex items-center justify-center w-7 h-7 rounded-md text-slate-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-slate-300 transition-colors",
                  title: isCollapsed ? "Espandi menu" : "Comprimi menu",
                  children: isCollapsed ? /* @__PURE__ */ jsx2(PanelLeftOpen, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx2(PanelLeftClose, { className: "w-4 h-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs2(
          "nav",
          {
            className: `flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-2 ${navClassName}`.trim(),
            children: [
              mainTree.map((item) => renderItem(item, isCollapsed)),
              adminTree.length > 0 && /* @__PURE__ */ jsxs2(Fragment2, { children: [
                /* @__PURE__ */ jsx2(
                  "div",
                  {
                    className: `mt-4 mb-2 ${isCollapsed ? "px-0 flex justify-center" : "px-2.5"}`,
                    children: /* @__PURE__ */ jsx2(
                      "div",
                      {
                        className: `border-t border-slate-200 dark:border-white/[0.08] ${isCollapsed ? "w-6" : "w-full"}`
                      }
                    )
                  }
                ),
                adminTree.map((item) => renderItem(item, isCollapsed))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs2(
          "div",
          {
            className: `border-t border-gray-100 dark:border-white/[0.06] space-y-2 ${isCollapsed ? "px-2 py-3" : "px-4 py-3"}`,
            children: [
              !isCollapsed && footerSlot,
              themeSlot && (isCollapsed ? /* @__PURE__ */ jsx2("div", { className: "flex justify-center", children: themeSlot }) : /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-white/[0.04] rounded-md", children: [
                /* @__PURE__ */ jsx2("span", { className: "text-[11px] text-slate-500 dark:text-slate-500", children: "Tema" }),
                themeSlot
              ] })),
              /* @__PURE__ */ jsxs2("div", { className: "relative", "data-user-menu": true, children: [
                /* @__PURE__ */ jsxs2(
                  "button",
                  {
                    onClick: () => setShowUserMenu(!showUserMenu),
                    className: `w-full flex items-center hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-md transition-colors ${isCollapsed ? "justify-center p-1" : "gap-2.5 px-2 py-1.5"}`,
                    title: isCollapsed ? user?.username : void 0,
                    children: [
                      /* @__PURE__ */ jsx2("div", { className: "w-[30px] h-[30px] bg-brand-50 dark:bg-brand-500/[0.15] rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx2("span", { className: "text-brand-600 dark:text-brand-400 text-[11px] font-semibold", children: user?.initials || user?.username?.substring(0, 2).toUpperCase() || "??" }) }),
                      !isCollapsed && /* @__PURE__ */ jsxs2(Fragment2, { children: [
                        /* @__PURE__ */ jsxs2("div", { className: "flex-1 min-w-0 text-left", children: [
                          /* @__PURE__ */ jsx2("div", { className: "text-slate-900 dark:text-slate-200 text-xs font-medium truncate", children: user?.username }),
                          /* @__PURE__ */ jsx2("div", { className: "text-slate-400 dark:text-slate-500 text-[10px]", children: user?.ruolo })
                        ] }),
                        /* @__PURE__ */ jsx2("div", { className: "w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" })
                      ] })
                    ]
                  }
                ),
                showUserMenu && /* @__PURE__ */ jsxs2(
                  "div",
                  {
                    className: `absolute bottom-full mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-white/10 z-[9999] py-1 ${isCollapsed ? "left-full ml-2 w-48" : "left-0 w-full"}`,
                    children: [
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onMouseDown: (e) => {
                            e.stopPropagation();
                            setShowUserMenu(false);
                            onOpenProfile?.();
                          },
                          className: "w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center gap-2",
                          children: [
                            /* @__PURE__ */ jsx2(Settings, { className: "w-4 h-4" }),
                            "Gestione Profilo"
                          ]
                        }
                      ),
                      userMenuExtras.map((entry) => {
                        const EntryIcon = entry.icon;
                        return /* @__PURE__ */ jsxs2(
                          "button",
                          {
                            onMouseDown: (e) => {
                              e.stopPropagation();
                              setShowUserMenu(false);
                              entry.onClick?.();
                            },
                            className: "w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] flex items-center gap-2",
                            children: [
                              EntryIcon && /* @__PURE__ */ jsx2(EntryIcon, { className: "w-4 h-4" }),
                              entry.label
                            ]
                          },
                          entry.id || entry.label
                        );
                      }),
                      /* @__PURE__ */ jsx2("div", { className: "border-t border-gray-100 dark:border-white/[0.06]" }),
                      /* @__PURE__ */ jsxs2(
                        "button",
                        {
                          onMouseDown: (e) => {
                            e.stopPropagation();
                            setShowUserMenu(false);
                            onLogout?.();
                          },
                          className: "w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2",
                          children: [
                            /* @__PURE__ */ jsx2(LogOut, { className: "w-4 h-4" }),
                            "Esci"
                          ]
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsxs2(Fragment2, { children: [
    /* @__PURE__ */ jsx2("aside", { className: "hidden md:flex flex-shrink-0", children: buildSidebar(collapsed, true) }),
    /* @__PURE__ */ jsxs2(
      "div",
      {
        className: `fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
        children: [
          /* @__PURE__ */ jsx2("div", { className: "absolute inset-0 bg-black/50", onClick: onClose }),
          /* @__PURE__ */ jsx2(
            "aside",
            {
              className: `relative z-50 h-full transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
              children: buildSidebar(false, false)
            }
          )
        ]
      }
    )
  ] });
}

// src/navTree.js
function normalizeNavTree(nodes = []) {
  const out = [];
  for (const node of nodes) {
    if (node?.visible === false) continue;
    if (!node?.children) {
      out.push(node);
      continue;
    }
    const children = normalizeNavTree(node.children);
    if (children.length === 0) continue;
    if (children.length === 1) {
      const only = children[0];
      out.push({ ...only, icon: only.icon || node.icon });
      continue;
    }
    out.push({ ...node, id: node.id || node.label, children });
  }
  return out;
}
function collectGroupIds(nodes = []) {
  const ids = [];
  for (const node of nodes) {
    if (node?.children) {
      ids.push(node.id || node.label);
      ids.push(...collectGroupIds(node.children));
    }
  }
  return ids;
}

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/tailwind-merge/dist/bundle-mjs.mjs
var CLASS_PART_SEPARATOR = "-";
var createClassGroupUtils = (config) => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = (className) => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    if (classParts[0] === "" && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
var getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return void 0;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(({
    validator
  }) => validator(classRest))?.classGroupId;
};
var arbitraryPropertyRegex = /^\[(.+)\]$/;
var getGroupIdForArbitraryProperty = (className) => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(":"));
    if (property) {
      return "arbitrary.." + property;
    }
  }
};
var createClassMap = (config) => {
  const {
    theme,
    prefix
  } = config;
  const classMap = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach((classDefinition) => {
    if (typeof classDefinition === "string") {
      const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === "function") {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup2]) => {
      processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
var getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
var isThemeGetter = (func) => func.isThemeGetter;
var getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(([classGroupId, classGroup]) => {
    const prefixedClassGroup = classGroup.map((classDefinition) => {
      if (typeof classDefinition === "string") {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === "object") {
        return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
};
var createLruCache = (maxCacheSize) => {
  if (maxCacheSize < 1) {
    return {
      get: () => void 0,
      set: () => {
      }
    };
  }
  let cacheSize = 0;
  let cache = /* @__PURE__ */ new Map();
  let previousCache = /* @__PURE__ */ new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = /* @__PURE__ */ new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== void 0) {
        return value;
      }
      if ((value = previousCache.get(key)) !== void 0) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
var IMPORTANT_MODIFIER = "!";
var createParseClassName = (config) => {
  const {
    separator,
    experimentalParseClassName
  } = config;
  const isSeparatorSingleCharacter = separator.length === 1;
  const firstSeparatorCharacter = separator[0];
  const separatorLength = separator.length;
  const parseClassName = (className) => {
    const modifiers = [];
    let bracketDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + separatorLength;
          continue;
        }
        if (currentCharacter === "/") {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === "[") {
        bracketDepth++;
      } else if (currentCharacter === "]") {
        bracketDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (experimentalParseClassName) {
    return (className) => experimentalParseClassName({
      className,
      parseClassName
    });
  }
  return parseClassName;
};
var sortModifiers = (modifiers) => {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  const sortedModifiers = [];
  let unsortedModifiers = [];
  modifiers.forEach((modifier) => {
    const isArbitraryVariant = modifier[0] === "[";
    if (isArbitraryVariant) {
      sortedModifiers.push(...unsortedModifiers.sort(), modifier);
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push(...unsortedModifiers.sort());
  return sortedModifiers;
};
var createConfigUtils = (config) => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  ...createClassGroupUtils(config)
});
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds
  } = configUtils;
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = "";
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(":");
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    result = originalClassName + (result.length > 0 ? " " + result : result);
  }
  return result;
};
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = "";
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
}
var toValue = (mix) => {
  if (typeof mix === "string") {
    return mix;
  }
  let resolvedValue;
  let string = "";
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
var fromTheme = (key) => {
  const themeGetter = (theme) => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
var fractionRegex = /^\d+\/\d+$/;
var stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isLength = (value) => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, "length", isLengthOnly);
var isNumber = (value) => Boolean(value) && !Number.isNaN(Number(value));
var isArbitraryNumber = (value) => getIsArbitraryValue(value, "number", isNumber);
var isInteger = (value) => Boolean(value) && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var sizeLabels = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
var isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, "position", isNever);
var imageLabels = /* @__PURE__ */ new Set(["image", "url"]);
var isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, "", isShadow);
var isAny = () => true;
var getIsArbitraryValue = (value, label, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return typeof label === "string" ? result[1] === label : label.has(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
var isLengthOnly = (value) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var getDefaultConfig = () => {
  const colors = fromTheme("colors");
  const spacing = fromTheme("spacing");
  const blur = fromTheme("blur");
  const brightness = fromTheme("brightness");
  const borderColor = fromTheme("borderColor");
  const borderRadius = fromTheme("borderRadius");
  const borderSpacing = fromTheme("borderSpacing");
  const borderWidth = fromTheme("borderWidth");
  const contrast = fromTheme("contrast");
  const grayscale = fromTheme("grayscale");
  const hueRotate = fromTheme("hueRotate");
  const invert = fromTheme("invert");
  const gap = fromTheme("gap");
  const gradientColorStops = fromTheme("gradientColorStops");
  const gradientColorStopPositions = fromTheme("gradientColorStopPositions");
  const inset = fromTheme("inset");
  const margin = fromTheme("margin");
  const opacity = fromTheme("opacity");
  const padding = fromTheme("padding");
  const saturate = fromTheme("saturate");
  const scale = fromTheme("scale");
  const sepia = fromTheme("sepia");
  const skew = fromTheme("skew");
  const space = fromTheme("space");
  const translate = fromTheme("translate");
  const getOverscroll = () => ["auto", "contain", "none"];
  const getOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
  const getSpacingWithAutoAndArbitrary = () => ["auto", isArbitraryValue, spacing];
  const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
  const getLengthWithEmptyAndArbitrary = () => ["", isLength, isArbitraryLength];
  const getNumberWithAutoAndArbitrary = () => ["auto", isNumber, isArbitraryValue];
  const getPositions = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
  const getLineStyles = () => ["solid", "dashed", "dotted", "double", "none"];
  const getBlendModes = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
  const getAlign = () => ["start", "end", "center", "between", "around", "evenly", "stretch"];
  const getZeroAndEmpty = () => ["", "0", isArbitraryValue];
  const getBreaks = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
  const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [isAny],
      spacing: [isLength, isArbitraryLength],
      blur: ["none", "", isTshirtSize, isArbitraryValue],
      brightness: getNumberAndArbitrary(),
      borderColor: [colors],
      borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmptyAndArbitrary(),
      contrast: getNumberAndArbitrary(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumberAndArbitrary(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumberAndArbitrary(),
      scale: getNumberAndArbitrary(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...getPositions(), isArbitraryValue]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", isInteger, isArbitraryValue]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", isInteger, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...getAlign()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...getAlign(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...getAlign(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [isArbitraryValue, spacing, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [isArbitraryValue, spacing, "none", "full", "min", "max", "fit", "prose", {
          screen: [isTshirtSize]
        }, isTshirtSize]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [isArbitraryValue, spacing, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isLength, isArbitraryValue]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...getLineStyles(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", isLength, isArbitraryLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", isLength, isArbitraryValue]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...getPositions(), isArbitraryPosition]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...getLineStyles(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [borderColor]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [borderColor]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...getLineStyles()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [isLength, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [isLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: getLengthWithEmptyAndArbitrary()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [isLength, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...getBlendModes(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [isLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
};
var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);

// src/lib/cn.js
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/lib/format.js
var LOCALE = "it-IT";
var valida = (v) => {
  if (v === null || v === void 0 || v === "") return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};
function formatNumero(v, opts = {}) {
  const predefinito = opts.style === "percent" ? 0 : 2;
  const maximumFractionDigits = Math.max(
    opts.minimumFractionDigits ?? 0,
    predefinito
  );
  return Number(v ?? 0).toLocaleString(LOCALE, {
    maximumFractionDigits,
    // it-IT skips the thousands separator on 4-digit numbers (1581); we want 1.581.
    useGrouping: "always",
    ...opts
  });
}
function formatData(v) {
  const d = valida(v);
  return d ? d.toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }) : "\u2014";
}
function formatDataOra(v) {
  const d = valida(v);
  return d ? d.toLocaleString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) : "\u2014";
}
function formatRelativo(v, ora = /* @__PURE__ */ new Date()) {
  const d = valida(v);
  if (!d) return "\u2014";
  const diff = Math.round((ora - d) / 1e3);
  const futuro = diff < 0;
  const sec = Math.abs(diff);
  if (sec < 60) return "adesso";
  const min = Math.round(sec / 60);
  if (min < 60) return futuro ? `tra ${min} min` : `${min} min fa`;
  const ore = Math.round(min / 60);
  if (ore < 24) {
    const n = ore === 1 ? "1 ora" : `${ore} ore`;
    return futuro ? `tra ${n}` : `${n} fa`;
  }
  const giorni = Math.round(ore / 24);
  if (futuro) return giorni === 1 ? "domani" : `tra ${giorni} giorni`;
  return giorni === 1 ? "ieri" : `${giorni} giorni fa`;
}

// src/theme/useTheme.js
import { useCallback, useEffect as useEffect3, useState as useState2 } from "react";
var leggi = () => typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light";
function useTheme() {
  const [theme, setThemeState] = useState2(leggi);
  useEffect3(() => {
    const obs = new MutationObserver(() => setThemeState(leggi()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => obs.disconnect();
  }, []);
  const setTheme = useCallback((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
    try {
      localStorage.setItem("theme", t);
    } catch {
    }
    setThemeState(t);
  }, []);
  const toggleTheme = useCallback(
    () => setTheme(leggi() === "dark" ? "light" : "dark"),
    [setTheme]
  );
  return { theme, setTheme, toggleTheme };
}

// src/theme/ThemeToggle.jsx
import { Moon, Sun } from "lucide-react";
import { jsx as jsx3 } from "react/jsx-runtime";
function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return /* @__PURE__ */ jsx3(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": dark,
      "aria-label": "Tema scuro",
      onClick: toggleTheme,
      className: cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
        "bg-slate-200 hover:bg-slate-300 active:bg-slate-400/70",
        "dark:bg-brand-600 dark:hover:bg-brand-500 dark:active:bg-brand-700",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      ),
      children: /* @__PURE__ */ jsx3(
        "span",
        {
          className: cn(
            "absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition-all duration-200",
            dark ? "left-[22px] bg-brand-950" : "left-0.5 bg-white"
          ),
          children: dark ? /* @__PURE__ */ jsx3(Sun, { className: "h-3 w-3 text-amber-400" }) : /* @__PURE__ */ jsx3(Moon, { className: "h-3 w-3 text-slate-500" })
        }
      )
    }
  );
}

// src/theme/initScript.js
var THEME_INIT_SCRIPT = "try{var t=null;try{t=localStorage.getItem('theme')}catch(e){}var d=t?t==='dark':window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',!!d);}catch(e){}";

// src/atoms/Button.jsx
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var VARIANTI = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  link: "text-primary underline-offset-4 hover:underline"
};
var TAGLIE = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2"
};
var buttonClasses = (variant = "primary", size = "md") => cn(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  VARIANTI[variant],
  TAGLIE[size]
);
var Button = forwardRef(function Button2({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth,
  className,
  children,
  type = "button",
  disabled,
  ...props
}, ref) {
  return /* @__PURE__ */ jsxs3(
    "button",
    {
      ref,
      type,
      ...props,
      disabled: disabled || loading,
      "aria-busy": loading || void 0,
      className: cn(
        buttonClasses(variant, size),
        fullWidth && "w-full",
        className
      ),
      children: [
        loading ? /* @__PURE__ */ jsx4(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": true }) : Icon && /* @__PURE__ */ jsx4(Icon, { className: "h-4 w-4", "aria-hidden": true }),
        children,
        !loading && IconRight && /* @__PURE__ */ jsx4(IconRight, { className: "h-4 w-4", "aria-hidden": true })
      ]
    }
  );
});
var Button_default = Button;

// src/atoms/IconButton.jsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var QUADRATI = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
var IconButton = forwardRef2(function IconButton2({
  icon: Icon,
  label,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...props
}, ref) {
  return /* @__PURE__ */ jsx5(
    "button",
    {
      ref,
      type,
      "aria-label": label,
      ...props,
      className: cn(
        buttonClasses(variant, size),
        "px-0 gap-0",
        QUADRATI[size],
        className
      ),
      children: Icon && /* @__PURE__ */ jsx5(Icon, { className: "h-4 w-4", "aria-hidden": true })
    }
  );
});
var IconButton_default = IconButton;

// src/atoms/Input.jsx
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var CAMPO = "w-full rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50";
var campoClasses = (invalid) => cn(
  CAMPO,
  invalid ? "border-destructive focus-visible:ring-destructive/40" : "border-input hover:border-ring/60 focus-visible:border-ring focus-visible:ring-ring/40"
);
var Input = forwardRef3(function Input2({ invalid, icon: Icon, className, ...props }, ref) {
  const input = /* @__PURE__ */ jsx6(
    "input",
    {
      ref,
      "aria-invalid": invalid ? "true" : void 0,
      ...props,
      className: cn(
        campoClasses(invalid),
        "h-10 px-3",
        Icon && "pl-9",
        className
      )
    }
  );
  if (!Icon) return input;
  return /* @__PURE__ */ jsxs4("div", { className: "relative w-full", children: [
    /* @__PURE__ */ jsx6(
      Icon,
      {
        className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
        "aria-hidden": true
      }
    ),
    input
  ] });
});
var Input_default = Input;

// src/atoms/Textarea.jsx
import { forwardRef as forwardRef4 } from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
var Textarea = forwardRef4(function Textarea2({ invalid, className, rows = 3, ...props }, ref) {
  return /* @__PURE__ */ jsx7(
    "textarea",
    {
      ref,
      rows,
      "aria-invalid": invalid ? "true" : void 0,
      ...props,
      className: cn(
        campoClasses(invalid),
        "min-h-[80px] resize-y px-3 py-2",
        className
      )
    }
  );
});
var Textarea_default = Textarea;

// src/atoms/tones.js
var TESTO = {
  neutral: "text-muted-foreground",
  primary: "text-brand-700 dark:text-primary",
  success: "text-green-800 dark:text-success",
  warning: "text-amber-800 dark:text-warning",
  danger: "text-red-700 dark:text-red-400",
  info: "text-sky-800 dark:text-info"
};
var SFONDI = {
  neutral: "bg-muted",
  primary: "bg-primary/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  danger: "bg-destructive/15",
  info: "bg-info/15"
};
var TINTE = Object.fromEntries(
  Object.keys(SFONDI).map((k) => [k, `${SFONDI[k]} ${TESTO[k]}`])
);
var PIENI = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info"
};

// src/atoms/Badge.jsx
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs5(
    "span",
    {
      ...props,
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TINTE[tone],
        className
      ),
      children: [
        dot && /* @__PURE__ */ jsx8(
          "span",
          {
            className: cn("h-1.5 w-1.5 rounded-full", PIENI[tone]),
            "aria-hidden": true
          }
        ),
        children
      ]
    }
  );
}

// src/atoms/StatusDot.jsx
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
function StatusDot({
  tone = "neutral",
  label,
  pulse = false,
  className
}) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return /* @__PURE__ */ jsxs6(
    "span",
    {
      ...a11y,
      className: cn("relative inline-flex h-2.5 w-2.5", className),
      children: [
        pulse && /* @__PURE__ */ jsx9(
          "span",
          {
            className: cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              PIENI[tone]
            )
          }
        ),
        /* @__PURE__ */ jsx9(
          "span",
          {
            className: cn(
              "relative inline-flex h-2.5 w-2.5 rounded-full",
              PIENI[tone]
            )
          }
        )
      ]
    }
  );
}

// src/atoms/Spinner.jsx
import { Loader2 as Loader22 } from "lucide-react";
import { jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
var TAGLIE2 = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
function Spinner({
  size = "sm",
  label = "Caricamento",
  className
}) {
  return /* @__PURE__ */ jsxs7(
    "span",
    {
      role: "status",
      className: cn("inline-flex items-center text-primary", className),
      children: [
        /* @__PURE__ */ jsx10(Loader22, { className: cn("animate-spin", TAGLIE2[size]), "aria-hidden": true }),
        /* @__PURE__ */ jsx10("span", { className: "sr-only", children: label })
      ]
    }
  );
}

// src/atoms/ProgressBar.jsx
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
function ProgressBar({
  value,
  max = 100,
  tone = "primary",
  label,
  showValue = false,
  className,
  "aria-label": ariaLabel
}) {
  const tetto = max > 0 ? max : 0;
  const now = tetto > 0 ? Math.min(Math.max(Number(value) || 0, 0), tetto) : 0;
  const pct = tetto > 0 ? now / tetto * 100 : 0;
  const larghezza = pct > 0 && pct < 2 ? 2 : pct;
  const testo = pct > 0 && pct < 1 ? "<1%" : `${Math.round(pct)}%`;
  return /* @__PURE__ */ jsxs8("div", { className: cn("w-full", className), children: [
    (label || showValue) && /* @__PURE__ */ jsxs8("div", { className: "mb-1 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsx11("span", { className: "font-medium text-foreground", children: label }),
      showValue && /* @__PURE__ */ jsx11("span", { className: "tabular-nums text-muted-foreground", children: testo })
    ] }),
    /* @__PURE__ */ jsx11(
      "div",
      {
        role: "progressbar",
        "aria-label": ariaLabel ?? label,
        "aria-valuenow": now,
        "aria-valuemin": 0,
        "aria-valuemax": tetto,
        className: "h-2 w-full overflow-hidden rounded-full bg-muted",
        children: /* @__PURE__ */ jsx11(
          "div",
          {
            className: cn(
              "h-full rounded-full transition-all duration-300",
              PIENI[tone]
            ),
            style: { width: `${larghezza}%` }
          }
        )
      }
    )
  ] });
}

// src/atoms/Kbd.jsx
import { jsx as jsx12 } from "react/jsx-runtime";
function Kbd({ children, className }) {
  return /* @__PURE__ */ jsx12(
    "kbd",
    {
      className: cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-border bg-muted px-1.5",
        "font-sans text-[11px] font-medium text-muted-foreground",
        className
      ),
      children
    }
  );
}

// src/molecules/Field.jsx
import { Children, cloneElement, isValidElement, useId } from "react";
import { jsx as jsx13, jsxs as jsxs9 } from "react/jsx-runtime";
function Field({
  label,
  hint,
  error,
  required,
  id,
  className,
  children
}) {
  const auto = useId();
  const child = Children.only(children);
  const fieldId = id || child.props?.id || auto;
  const hintId = hint ? `${fieldId}-hint` : null;
  const errorId = error ? `${fieldId}-error` : null;
  const describedBy = [child.props?.["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || void 0;
  const control = isValidElement(child) ? cloneElement(child, {
    id: fieldId,
    "aria-describedby": describedBy,
    ...error ? { "aria-invalid": "true" } : {}
  }) : child;
  return /* @__PURE__ */ jsxs9("div", { className: cn("flex flex-col gap-1.5", className), children: [
    label && /* @__PURE__ */ jsxs9(
      "label",
      {
        htmlFor: fieldId,
        className: "text-sm font-medium text-foreground",
        children: [
          label,
          required && /* @__PURE__ */ jsx13("span", { className: cn("ml-0.5", TESTO.danger), "aria-hidden": true, children: "*" })
        ]
      }
    ),
    control,
    hint && !error && /* @__PURE__ */ jsx13("p", { id: hintId, className: "text-xs text-muted-foreground", children: hint }),
    error && /* @__PURE__ */ jsx13("p", { id: errorId, role: "alert", className: cn("text-xs", TESTO.danger), children: error })
  ] });
}

// src/molecules/Select.jsx
import { useEffect as useEffect4, useId as useId2, useRef, useState as useState4 } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

// src/molecules/useFloatingList.js
import { useCallback as useCallback2, useLayoutEffect, useState as useState3 } from "react";
var GAP = 4;
var MAX_HEIGHT = 256;
var MARGIN = 8;
function useFloatingList(triggerRef, open) {
  const [style, setStyle] = useState3(null);
  const misura = useCallback2(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r2 = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const sotto = vh - r2.bottom - GAP - MARGIN;
    const sopra = r2.top - GAP - MARGIN;
    const suSu = sotto < MAX_HEIGHT && sopra > sotto;
    const spazio = Math.max(suSu ? sopra : sotto, 0);
    setStyle({
      position: "fixed",
      left: r2.left,
      width: r2.width,
      maxHeight: Math.min(MAX_HEIGHT, spazio) || MAX_HEIGHT,
      ...suSu ? { bottom: vh - r2.top + GAP } : { top: r2.bottom + GAP }
    });
  }, [triggerRef]);
  useLayoutEffect(() => {
    if (!open) return void 0;
    misura();
    const suScroll = (e) => {
      const t = e.target;
      if (!(t instanceof Element) || t.contains(triggerRef.current))
        misura();
    };
    window.addEventListener("scroll", suScroll, true);
    window.addEventListener("resize", misura);
    return () => {
      window.removeEventListener("scroll", suScroll, true);
      window.removeEventListener("resize", misura);
    };
  }, [open, misura, triggerRef]);
  return style;
}

// src/molecules/Select.jsx
import { jsx as jsx14, jsxs as jsxs10 } from "react/jsx-runtime";
var CLEAR = "__clear__";
function Select({
  value,
  onChange,
  options = [],
  placeholder = "Seleziona\u2026",
  allowClear = false,
  disabled = false,
  invalid,
  "aria-label": ariaLabel,
  className,
  onKeyDown: onKeyDownProp,
  onKeyUp: onKeyUpProp,
  onClick: onClickProp,
  ...rest
}) {
  const [open, setOpen] = useState4(false);
  const [active, setActive] = useState4(-1);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const uid = useId2();
  const listStyle = useFloatingList(triggerRef, open);
  const entries = [
    ...allowClear ? [{ value: CLEAR, label: "Nessuno", clear: true }] : [],
    ...options
  ];
  const selected = options.find((o) => o.value === value);
  const optId = (i) => `${uid}-opt-${i}`;
  useEffect4(() => {
    if (!open) return void 0;
    const fuori = (e) => {
      const dentro = rootRef.current?.contains(e.target) || listRef.current?.contains(e.target);
      if (!dentro) setOpen(false);
    };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, [open]);
  const apri = () => {
    if (disabled) return;
    const i = entries.findIndex(
      (o) => !o.clear && o.value === value && !o.disabled
    );
    setActive(i >= 0 ? i : entries.findIndex((o) => !o.disabled));
    setOpen(true);
  };
  const scegli = (o) => {
    if (!o || o.disabled) return;
    onChange?.(o.clear ? null : o.value);
    setOpen(false);
  };
  const muovi = (dir) => {
    let i = active;
    for (let n = 0; n < entries.length; n += 1) {
      i = (i + dir + entries.length) % entries.length;
      if (!entries[i].disabled) {
        setActive(i);
        return;
      }
    }
  };
  const onKeyDown = (e) => {
    onKeyDownProp?.(e);
    if (disabled || e.defaultPrevented) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) apri();
      else muovi(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) apri();
      else scegli(entries[active]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs10("div", { ref: rootRef, className: cn("relative", className), children: [
    /* @__PURE__ */ jsxs10(
      "button",
      {
        ...rest,
        ref: triggerRef,
        type: "button",
        disabled,
        "aria-label": ariaLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": open ? `${uid}-list` : void 0,
        "aria-activedescendant": open && active >= 0 ? optId(active) : void 0,
        "aria-invalid": invalid ? "true" : void 0,
        onClick: (e) => {
          onClickProp?.(e);
          if (!e.defaultPrevented) open ? setOpen(false) : apri();
        },
        onKeyDown,
        onKeyUp: (e) => {
          onKeyUpProp?.(e);
          if (e.key === " ") e.preventDefault();
        },
        className: cn(
          campoClasses(invalid),
          "flex h-10 items-center justify-between gap-2 px-3 text-left"
        ),
        children: [
          /* @__PURE__ */ jsx14("span", { className: cn("truncate", !selected && "text-muted-foreground"), children: selected ? selected.label : placeholder }),
          /* @__PURE__ */ jsx14(
            ChevronDown,
            {
              className: cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180"
              ),
              "aria-hidden": true
            }
          )
        ]
      }
    ),
    open && createPortal(
      /* @__PURE__ */ jsx14(
        "ul",
        {
          ref: listRef,
          id: `${uid}-list`,
          role: "listbox",
          "aria-label": ariaLabel,
          style: listStyle ?? { position: "fixed" },
          onMouseDown: (e) => e.preventDefault(),
          className: "z-[70] max-h-64 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg",
          children: entries.map((o, i) => {
            const sel = !o.clear && o.value === value;
            return /* @__PURE__ */ jsxs10(
              "li",
              {
                id: optId(i),
                role: "option",
                "aria-selected": sel,
                "aria-disabled": o.disabled || void 0,
                onMouseEnter: () => !o.disabled && setActive(i),
                onClick: () => scegli(o),
                className: cn(
                  "flex cursor-pointer items-start gap-2 px-3 py-2 text-sm transition-colors",
                  o.disabled && "cursor-not-allowed opacity-50",
                  i === active && "bg-muted",
                  sel ? "text-primary" : "text-foreground",
                  o.clear && "italic text-muted-foreground"
                ),
                children: [
                  /* @__PURE__ */ jsxs10("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx14("div", { className: "font-medium", children: o.label }),
                    o.description && /* @__PURE__ */ jsx14("div", { className: "mt-0.5 text-xs text-muted-foreground", children: o.description })
                  ] }),
                  sel && /* @__PURE__ */ jsx14(Check, { className: "mt-0.5 h-4 w-4 shrink-0", "aria-hidden": true })
                ]
              },
              o.value
            );
          })
        }
      ),
      document.body
    )
  ] });
}

// src/molecules/Toggle.jsx
import { useId as useId3 } from "react";
import { jsx as jsx15, jsxs as jsxs11 } from "react/jsx-runtime";
function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
  id,
  "aria-describedby": describedBy,
  ...rest
}) {
  const uid = useId3();
  const cambia = () => {
    if (!disabled) onChange?.(!checked);
  };
  const descrizione = [describedBy, description ? `${uid}-d` : null].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs11("div", { className: cn("flex items-start gap-3", className), children: [
    /* @__PURE__ */ jsx15(
      "button",
      {
        "aria-labelledby": label ? `${uid}-l` : void 0,
        ...rest,
        id,
        type: "button",
        role: "switch",
        "aria-checked": !!checked,
        "aria-describedby": descrizione,
        disabled,
        onClick: cambia,
        className: cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary hover:bg-primary/90" : "bg-muted-foreground/30 hover:bg-muted-foreground/40"
        ),
        children: /* @__PURE__ */ jsx15(
          "span",
          {
            "aria-hidden": true,
            className: cn(
              "inline-block h-4 w-4 rounded-full bg-background shadow transition-transform",
              checked ? "translate-x-[18px]" : "translate-x-0.5"
            )
          }
        )
      }
    ),
    (label || description) && /* @__PURE__ */ jsxs11("div", { className: "min-w-0", children: [
      label && /* @__PURE__ */ jsx15(
        "div",
        {
          id: `${uid}-l`,
          onClick: cambia,
          "data-no-row-click": true,
          className: cn(
            "select-none text-sm font-medium text-foreground",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          ),
          children: label
        }
      ),
      description && /* @__PURE__ */ jsx15(
        "div",
        {
          id: `${uid}-d`,
          "data-no-row-click": true,
          className: "text-xs text-muted-foreground",
          children: description
        }
      )
    ] })
  ] });
}

// src/molecules/Checkbox.jsx
import { useId as useId4 } from "react";
import { Check as Check2, Minus } from "lucide-react";
import { jsx as jsx16, jsxs as jsxs12 } from "react/jsx-runtime";
function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
  disabled,
  className,
  id,
  ...rest
}) {
  const uid = useId4();
  const on = indeterminate || checked;
  const cambia = () => {
    if (!disabled) onChange?.(indeterminate ? true : !checked);
  };
  return /* @__PURE__ */ jsxs12("div", { className: cn("flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsx16(
      "button",
      {
        "aria-labelledby": label ? uid : void 0,
        ...rest,
        id,
        type: "button",
        role: "checkbox",
        "aria-checked": indeterminate ? "mixed" : !!checked,
        disabled,
        onClick: cambia,
        className: cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "active:scale-90 disabled:cursor-not-allowed disabled:opacity-50",
          on ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" : "border-input bg-background hover:border-ring/60"
        ),
        children: indeterminate ? /* @__PURE__ */ jsx16(Minus, { className: "h-3 w-3", strokeWidth: 3, "aria-hidden": true }) : checked && /* @__PURE__ */ jsx16(Check2, { className: "h-3 w-3", strokeWidth: 3, "aria-hidden": true })
      }
    ),
    label && /* @__PURE__ */ jsx16(
      "span",
      {
        id: uid,
        onClick: cambia,
        "data-no-row-click": true,
        className: cn(
          "select-none text-sm text-foreground",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        ),
        children: label
      }
    )
  ] });
}

// src/molecules/Tabs.jsx
import { useId as useId5, useRef as useRef2 } from "react";
import { jsx as jsx17, jsxs as jsxs13 } from "react/jsx-runtime";
var tabId = (prefix, id) => prefix ? `${prefix}-tab-${id}` : `tab-${id}`;
var panelId = (prefix, id) => prefix ? `${prefix}-panel-${id}` : `panel-${id}`;
function useTabIds() {
  const prefix = useId5().replace(/:/g, "");
  return {
    prefix,
    tab: (id) => tabId(prefix, id),
    panel: (id) => panelId(prefix, id)
  };
}
function Tabs({
  value,
  onChange,
  items = [],
  "aria-label": ariaLabel,
  idPrefix,
  className
}) {
  const refs = useRef2([]);
  const vai = (i) => {
    const n = (i + items.length) % items.length;
    onChange?.(items[n].id);
    refs.current[n]?.focus();
  };
  return /* @__PURE__ */ jsx17(
    "div",
    {
      role: "tablist",
      "aria-label": ariaLabel,
      className: cn(
        "flex gap-6 overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      ),
      children: items.map((t, i) => {
        const attiva = t.id === value;
        const Icon = t.icon;
        return /* @__PURE__ */ jsxs13(
          "button",
          {
            ref: (el) => {
              refs.current[i] = el;
            },
            type: "button",
            role: "tab",
            id: tabId(idPrefix, t.id),
            "aria-selected": attiva,
            "aria-controls": attiva ? panelId(idPrefix, t.id) : void 0,
            tabIndex: attiva ? 0 : -1,
            onClick: () => onChange?.(t.id),
            onKeyDown: (e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                vai(i + 1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                vai(i - 1);
              }
            },
            className: cn(
              "-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              attiva ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            ),
            children: [
              Icon && /* @__PURE__ */ jsx17(Icon, { className: "h-4 w-4", "aria-hidden": true }),
              t.label,
              t.count != null && /* @__PURE__ */ jsx17("span", { className: "rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground", children: t.count })
            ]
          },
          t.id
        );
      })
    }
  );
}

// src/molecules/SegmentedControl.jsx
import { useRef as useRef3 } from "react";
import { jsx as jsx18, jsxs as jsxs14 } from "react/jsx-runtime";
var SIZE = { sm: "h-7 px-3 text-xs", md: "h-9 px-4 text-sm" };
function SegmentedControl({
  value,
  onChange,
  options = [],
  size = "sm",
  "aria-label": ariaLabel,
  className
}) {
  const refs = useRef3([]);
  const vai = (i) => {
    const n = (i + options.length) % options.length;
    onChange?.(options[n].value);
    refs.current[n]?.focus();
  };
  return /* @__PURE__ */ jsx18(
    "div",
    {
      role: "radiogroup",
      "aria-label": ariaLabel,
      className: cn("inline-flex rounded-lg bg-muted p-1", className),
      children: options.map((o, i) => {
        const attivo = o.value === value;
        const Icon = o.icon;
        return /* @__PURE__ */ jsxs14(
          "button",
          {
            ref: (el) => {
              refs.current[i] = el;
            },
            type: "button",
            role: "radio",
            "aria-checked": attivo,
            tabIndex: attivo ? 0 : -1,
            onClick: () => onChange?.(o.value),
            onKeyDown: (e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                vai(i + 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                vai(i - 1);
              }
            },
            className: cn(
              "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              SIZE[size] || SIZE.sm,
              attivo ? "bg-background text-primary shadow" : "text-muted-foreground hover:text-foreground"
            ),
            children: [
              Icon && /* @__PURE__ */ jsx18(Icon, { className: "h-3.5 w-3.5", "aria-hidden": true }),
              o.label
            ]
          },
          o.value
        );
      })
    }
  );
}

// src/molecules/Tooltip.jsx
import {
  Children as Children2,
  cloneElement as cloneElement2,
  useCallback as useCallback3,
  useEffect as useEffect5,
  useId as useId6,
  useRef as useRef4,
  useState as useState5
} from "react";
import { jsx as jsx19, jsxs as jsxs15 } from "react/jsx-runtime";
var DELAY_MS = 150;
var SIDE = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2"
};
function Tooltip({
  content,
  side = "top",
  wide = false,
  children
}) {
  const id = useId6();
  const [open, setOpen] = useState5(false);
  const timer = useRef4(null);
  const child = Children2.only(children);
  const show = useCallback3(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), DELAY_MS);
  }, []);
  const hide = useCallback3(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, []);
  useEffect5(() => () => clearTimeout(timer.current), []);
  const chain = (name, fn) => (e) => {
    child.props[name]?.(e);
    fn(e);
  };
  const proprio = child.props["aria-describedby"];
  const trigger = cloneElement2(child, {
    "aria-describedby": open ? [proprio, id].filter(Boolean).join(" ") : proprio,
    onMouseEnter: chain("onMouseEnter", show),
    onMouseLeave: chain("onMouseLeave", hide),
    onFocus: chain("onFocus", show),
    onBlur: chain("onBlur", hide),
    onKeyDown: chain("onKeyDown", (e) => {
      if (e.key !== "Escape" || !open) return;
      e.preventDefault();
      hide();
    })
  });
  return /* @__PURE__ */ jsxs15("span", { className: "relative inline-flex", children: [
    trigger,
    open && content != null && /* @__PURE__ */ jsx19(
      "span",
      {
        id,
        role: "tooltip",
        className: cn(
          "pointer-events-none absolute z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md",
          wide ? "w-max max-w-xs whitespace-normal text-left" : "whitespace-nowrap",
          SIDE[side] || SIDE.top
        ),
        children: content
      }
    )
  ] });
}

// src/molecules/InfoTip.jsx
import { HelpCircle } from "lucide-react";
import { jsx as jsx20 } from "react/jsx-runtime";
var LONG = 40;
function InfoTip({
  children,
  label = "Maggiori informazioni",
  side = "top",
  wide
}) {
  const long = wide ?? (typeof children === "string" && children.length > LONG);
  return /* @__PURE__ */ jsx20(Tooltip, { content: children, side, wide: long, children: /* @__PURE__ */ jsx20(
    "button",
    {
      type: "button",
      "aria-label": label,
      className: "inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      children: /* @__PURE__ */ jsx20(HelpCircle, { className: "h-4 w-4", "aria-hidden": true })
    }
  ) });
}

// src/organisms/Card.jsx
import { jsx as jsx21, jsxs as jsxs16 } from "react/jsx-runtime";
function Card({ className, interactive = false, children, ...props }) {
  return /* @__PURE__ */ jsx21(
    "div",
    {
      ...props,
      className: cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        interactive && "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
        className
      ),
      children
    }
  );
}
function CardHeader({
  title,
  description,
  actions,
  className,
  children
}) {
  return /* @__PURE__ */ jsxs16(
    "div",
    {
      className: cn(
        "flex items-start justify-between gap-4 p-5 pb-0",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs16("div", { className: "min-w-0 space-y-1", children: [
          title && /* @__PURE__ */ jsx21(CardTitle, { children: title }),
          description && /* @__PURE__ */ jsx21(CardDescription, { children: description }),
          children
        ] }),
        actions && /* @__PURE__ */ jsx21("div", { className: "flex shrink-0 items-center gap-2", children: actions })
      ]
    }
  );
}
function CardTitle({ className, children, ...props }) {
  return /* @__PURE__ */ jsx21(
    "h3",
    {
      ...props,
      className: cn("text-base font-semibold leading-tight", className),
      children
    }
  );
}
function CardDescription({ className, children, ...props }) {
  return /* @__PURE__ */ jsx21("p", { ...props, className: cn("text-sm text-muted-foreground", className), children });
}
function CardContent({ className, children, ...props }) {
  return /* @__PURE__ */ jsx21("div", { ...props, className: cn("p-5", className), children });
}
function CardFooter({ className, children, ...props }) {
  return /* @__PURE__ */ jsx21(
    "div",
    {
      ...props,
      className: cn("flex items-center gap-2 border-t p-4", className),
      children
    }
  );
}

// src/organisms/KpiCard.jsx
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// src/organisms/Skeleton.jsx
import { jsx as jsx22, jsxs as jsxs17 } from "react/jsx-runtime";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx22(
    "div",
    {
      "aria-hidden": true,
      ...props,
      className: cn("animate-pulse rounded-md bg-muted", className)
    }
  );
}
function SkeletonText({ lines = 3 }) {
  return /* @__PURE__ */ jsx22("div", { className: "space-y-2", role: "status", "aria-label": "Caricamento", children: Array.from({ length: lines }, (_, i) => /* @__PURE__ */ jsx22(
    Skeleton,
    {
      className: cn(
        "h-4",
        i === lines - 1 && lines > 1 ? "w-2/3" : "w-full"
      )
    },
    i
  )) });
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxs17("div", { className: "rounded-xl border bg-card p-5 shadow-sm space-y-4", children: [
    /* @__PURE__ */ jsx22(Skeleton, { className: "h-4 w-1/3" }),
    /* @__PURE__ */ jsx22(Skeleton, { className: "h-8 w-1/2" }),
    /* @__PURE__ */ jsx22(SkeletonText, { lines: 2 })
  ] });
}
function SkeletonTable({ rows = 5, cols = 4 }) {
  return /* @__PURE__ */ jsxs17("div", { className: "space-y-3", role: "status", "aria-label": "Caricamento", children: [
    /* @__PURE__ */ jsx22("div", { className: "flex gap-4", children: Array.from({ length: cols }, (_, c) => /* @__PURE__ */ jsx22(Skeleton, { className: "h-4 flex-1" }, c)) }),
    Array.from({ length: rows }, (_, r2) => /* @__PURE__ */ jsx22("div", { className: "flex gap-4", children: Array.from({ length: cols }, (_2, c) => /* @__PURE__ */ jsx22(Skeleton, { className: "h-6 flex-1" }, c)) }, r2))
  ] });
}

// src/segnalazioni/segnalaAttr.js
function segnalaAttr(descrittore) {
  if (!descrittore || typeof descrittore !== "object") return {};
  const { tipo, id, nome, contesto } = descrittore;
  const pulito = {};
  if (tipo !== void 0) pulito.tipo = tipo;
  if (id !== void 0) pulito.id = id;
  if (nome !== void 0) pulito.nome = nome;
  if (contesto !== void 0) pulito.contesto = contesto;
  return { "data-segnala": JSON.stringify(pulito) };
}

// src/organisms/KpiCard.jsx
import { jsx as jsx23, jsxs as jsxs18 } from "react/jsx-runtime";
var vuoto = (v) => v === null || v === void 0 || typeof v === "number" && Number.isNaN(v);
function Delta({ delta }) {
  const su = delta.value > 0;
  const giu = delta.value < 0;
  const Icona = giu ? ArrowDownRight : ArrowUpRight;
  return /* @__PURE__ */ jsxs18(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        su && TESTO.success,
        giu && TESTO.danger,
        !su && !giu && "text-muted-foreground"
      ),
      children: [
        (su || giu) && /* @__PURE__ */ jsx23(Icona, { className: "h-3.5 w-3.5", "aria-hidden": true }),
        su ? "+" : "",
        formatNumero(delta.value),
        delta.label && /* @__PURE__ */ jsx23("span", { className: "ml-1 font-normal text-muted-foreground", children: delta.label })
      ]
    }
  );
}
function KpiCard({
  label,
  value,
  hint,
  delta,
  tone = "neutral",
  icon: Icon,
  loading = false,
  help,
  segnala,
  className
}) {
  const mostrato = vuoto(value) ? "\u2014" : typeof value === "number" ? formatNumero(value) : value;
  return /* @__PURE__ */ jsxs18(Card, { className: cn("p-5", className), ...segnalaAttr(segnala), children: [
    /* @__PURE__ */ jsxs18("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs18("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxs18("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx23("span", { className: "truncate", children: label }),
          help && /* @__PURE__ */ jsx23(InfoTip, { children: help })
        ] }),
        loading ? /* @__PURE__ */ jsx23(Skeleton, { className: "mt-2 h-8 w-24" }) : /* @__PURE__ */ jsx23("p", { className: "mt-1 text-3xl font-bold tabular-nums tracking-tight", children: mostrato })
      ] }),
      Icon && /* @__PURE__ */ jsx23(
        "span",
        {
          className: cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            TINTE[tone] ?? TINTE.neutral
          ),
          children: /* @__PURE__ */ jsx23(Icon, { className: "h-5 w-5", "aria-hidden": true })
        }
      )
    ] }),
    !loading && (delta || hint) && /* @__PURE__ */ jsxs18("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
      delta && /* @__PURE__ */ jsx23(Delta, { delta }),
      hint && /* @__PURE__ */ jsx23("span", { className: "text-xs text-muted-foreground", children: hint })
    ] })
  ] });
}

// src/organisms/EmptyState.jsx
import { jsx as jsx24, jsxs as jsxs19 } from "react/jsx-runtime";
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}) {
  return /* @__PURE__ */ jsxs19(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      ),
      children: [
        /* @__PURE__ */ jsx24("span", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground", children: /* @__PURE__ */ jsx24(Icon, { className: "h-6 w-6", "aria-hidden": true }) }),
        /* @__PURE__ */ jsxs19("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx24("p", { className: "text-base font-semibold", children: title }),
          description && /* @__PURE__ */ jsx24("p", { className: "max-w-sm text-sm text-muted-foreground", children: description })
        ] }),
        action && /* @__PURE__ */ jsx24("div", { className: "mt-1", children: action })
      ]
    }
  );
}

// src/organisms/Alert.jsx
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { jsx as jsx25, jsxs as jsxs20 } from "react/jsx-runtime";
var TONI = {
  info: {
    box: "border-info/30 bg-info/10 text-sky-900 dark:text-sky-100",
    icon: "text-info",
    Icona: Info
  },
  success: {
    box: "border-success/30 bg-success/10 text-green-900 dark:text-green-100",
    icon: "text-success",
    Icona: CheckCircle2
  },
  warning: {
    box: "border-warning/40 bg-warning/10 text-amber-900 dark:text-amber-100",
    icon: "text-warning",
    Icona: AlertTriangle
  },
  danger: {
    box: "border-destructive/30 bg-destructive/10 text-red-900 dark:text-red-100",
    icon: "text-destructive",
    Icona: XCircle
  }
};
function Alert({
  tone = "info",
  title,
  children,
  onClose,
  className
}) {
  const t = TONI[tone] ?? TONI.info;
  const urgente = tone === "danger" || tone === "warning";
  return /* @__PURE__ */ jsxs20(
    "div",
    {
      role: urgente ? "alert" : "status",
      className: cn(
        "flex gap-3 rounded-lg border p-4 text-sm",
        t.box,
        className
      ),
      children: [
        /* @__PURE__ */ jsx25(t.Icona, { className: cn("mt-0.5 h-5 w-5 shrink-0", t.icon), "aria-hidden": true }),
        /* @__PURE__ */ jsxs20("div", { className: "min-w-0 flex-1", children: [
          title && /* @__PURE__ */ jsx25("p", { className: "font-semibold", children: title }),
          children && /* @__PURE__ */ jsx25("div", { className: cn(title && "mt-0.5"), children })
        ] }),
        onClose && /* @__PURE__ */ jsx25(
          IconButton_default,
          {
            icon: X,
            label: "Chiudi",
            size: "sm",
            onClick: onClose,
            className: "-my-1 -mr-1 shrink-0"
          }
        )
      ]
    }
  );
}

// src/organisms/Pagination.jsx
import { ChevronLeft, ChevronRight as ChevronRight2 } from "lucide-react";
import { jsx as jsx26, jsxs as jsxs21 } from "react/jsx-runtime";
function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className
}) {
  if (total <= pageSize && page <= 1) return null;
  const pagine = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pagine);
  const da = (p - 1) * pageSize + 1;
  const a = Math.min(p * pageSize, total);
  return /* @__PURE__ */ jsxs21(
    "nav",
    {
      "aria-label": "Paginazione",
      className: cn("flex items-center justify-between gap-3", className),
      children: [
        /* @__PURE__ */ jsx26("p", { className: "text-sm text-muted-foreground tabular-nums", children: total > 0 ? `${formatNumero(da)}\u2013${formatNumero(a)} di ${formatNumero(total)}` : "Nessun risultato" }),
        /* @__PURE__ */ jsxs21("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx26(
            Button_default,
            {
              variant: "outline",
              size: "sm",
              icon: ChevronLeft,
              disabled: page <= 1,
              onClick: () => onPageChange(Math.min(page - 1, pagine)),
              "aria-label": "Pagina precedente",
              children: "Precedente"
            }
          ),
          /* @__PURE__ */ jsx26(
            Button_default,
            {
              variant: "outline",
              size: "sm",
              iconRight: ChevronRight2,
              disabled: p >= pagine,
              onClick: () => onPageChange(p + 1),
              "aria-label": "Pagina successiva",
              children: "Successiva"
            }
          )
        ] })
      ]
    }
  );
}

// src/organisms/DataTable.jsx
import { ChevronDown as ChevronDown2, ChevronUp, ChevronsUpDown, Inbox } from "lucide-react";

// src/organisms/useSort.js
import { useCallback as useCallback4, useMemo, useState as useState6 } from "react";
function normalizza(v) {
  const x = v instanceof Date ? v.valueOf() : v;
  return typeof x === "number" && Number.isNaN(x) ? null : x;
}
var isNil = (v) => v === null || v === void 0;
function compare(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "it", {
    numeric: true,
    sensitivity: "base"
  });
}
function useSort(rows, { initial = null, accessors = {} } = {}) {
  const [sort, setSort] = useState6(initial);
  const toggle = useCallback4((key) => {
    setSort(
      (prev) => prev && prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }, []);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const get = accessors[sort.key] || ((row) => row[sort.key]);
    const sign = sort.dir === "desc" ? -1 : 1;
    return [...rows].sort((ra, rb) => {
      const a = normalizza(get(ra));
      const b = normalizza(get(rb));
      if (isNil(a) && isNil(b)) return 0;
      if (isNil(a)) return 1;
      if (isNil(b)) return -1;
      return sign * compare(a, b);
    });
  }, [rows, sort]);
  return { sorted, sort, toggle };
}

// src/organisms/DataTable.jsx
import { jsx as jsx27, jsxs as jsxs22 } from "react/jsx-runtime";
var INTERATTIVI = "a,button,input,textarea,select,[role=listbox],[role=option],[role=switch],[role=checkbox],[data-no-row-click]";
var ALIGN = { left: "text-left", right: "text-right", center: "text-center" };
var JUSTIFY = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center"
};
function SortIcon({ dir }) {
  const Icon = dir === "asc" ? ChevronUp : dir === "desc" ? ChevronDown2 : ChevronsUpDown;
  return /* @__PURE__ */ jsx27(Icon, { className: cn("h-3.5 w-3.5", !dir && "opacity-40"), "aria-hidden": true });
}
function DataTable({
  columns,
  rows,
  rowKey,
  onRowClick,
  loading = false,
  empty,
  initialSort,
  dense = false,
  caption,
  segnala,
  className
}) {
  const accessors = {};
  columns.forEach((c) => {
    if (c.sortAccessor) accessors[c.key] = c.sortAccessor;
  });
  const { sorted, sort, toggle } = useSort(rows, {
    initial: initialSort,
    accessors
  });
  const pad = dense ? "px-3 py-1.5" : "px-4 py-3";
  let body;
  if (loading && rows.length === 0) {
    body = /* @__PURE__ */ jsx27("div", { className: "p-4", children: /* @__PURE__ */ jsx27(SkeletonTable, { rows: 5, cols: columns.length }) });
  } else if (rows.length === 0) {
    body = empty === void 0 ? /* @__PURE__ */ jsx27(EmptyState, { icon: Inbox, title: "Nessun dato" }) : typeof empty === "string" ? /* @__PURE__ */ jsx27("p", { className: "px-6 py-12 text-center text-sm text-muted-foreground", children: empty }) : empty;
  }
  return /* @__PURE__ */ jsx27(Card, { className: cn("p-0", className), ...segnalaAttr(segnala), children: /* @__PURE__ */ jsx27("div", { className: "overflow-x-auto", children: body ? body : /* @__PURE__ */ jsxs22("table", { className: "w-full text-sm", children: [
    caption && /* @__PURE__ */ jsx27("caption", { className: "sr-only", children: caption }),
    /* @__PURE__ */ jsx27("thead", { className: "border-b bg-muted/50 font-medium text-muted-foreground", children: /* @__PURE__ */ jsx27("tr", { children: columns.map((c) => {
      const active = sort && sort.key === c.key ? sort.dir : null;
      const align = ALIGN[c.align] || ALIGN.left;
      return /* @__PURE__ */ jsx27(
        "th",
        {
          scope: "col",
          ...segnalaAttr(c.segnala),
          style: c.width ? { width: c.width } : void 0,
          "aria-sort": c.sortable ? active === "asc" ? "ascending" : active === "desc" ? "descending" : "none" : void 0,
          className: cn(
            pad,
            "whitespace-nowrap font-medium",
            align,
            c.className
          ),
          children: c.sortable ? /* @__PURE__ */ jsxs22(
            "button",
            {
              type: "button",
              onClick: () => toggle(c.key),
              className: cn(
                "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                JUSTIFY[c.align] || JUSTIFY.left,
                active && "text-foreground"
              ),
              children: [
                c.header,
                /* @__PURE__ */ jsx27(SortIcon, { dir: active })
              ]
            }
          ) : c.header
        },
        c.key
      );
    }) }) }),
    /* @__PURE__ */ jsx27("tbody", { className: "divide-y", children: sorted.map((row) => /* @__PURE__ */ jsx27(
      "tr",
      {
        tabIndex: onRowClick ? 0 : void 0,
        onClick: onRowClick ? (e) => {
          const hit = e.target.closest?.(INTERATTIVI);
          if (hit && e.currentTarget.contains(hit)) return;
          onRowClick(row);
        } : void 0,
        onKeyDown: onRowClick ? (e) => {
          if (e.key === "Enter" && e.target === e.currentTarget)
            onRowClick(row);
        } : void 0,
        className: cn(
          "transition-colors hover:bg-muted/40",
          onRowClick && "cursor-pointer focus-visible:outline-none focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        ),
        children: columns.map((c) => /* @__PURE__ */ jsx27(
          "td",
          {
            ...segnalaAttr(c.segnala),
            className: cn(
              pad,
              ALIGN[c.align] || ALIGN.left,
              c.className
            ),
            children: c.cell ? c.cell(row) : row[c.key] ?? ""
          },
          c.key
        ))
      },
      rowKey(row)
    )) })
  ] }) }) });
}

// src/organisms/Dialog.jsx
import { useEffect as useEffect6, useId as useId7, useRef as useRef5 } from "react";
import { createPortal as createPortal2 } from "react-dom";
import { X as X2 } from "lucide-react";
import { jsx as jsx28, jsxs as jsxs23 } from "react/jsx-runtime";
var SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl"
};
var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
var pila = [];
var focusables = (root) => Array.from(root.querySelectorAll(FOCUSABLE)).filter(
  (el) => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true"
);
function Dialog({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  size = "sm",
  footer,
  children,
  closeOnBackdrop = true,
  closeDisabled = false,
  className
}) {
  const titleId = useId7();
  const descId = useId7();
  const panelRef = useRef5(null);
  const onCloseRef = useRef5(onClose);
  onCloseRef.current = onClose;
  useEffect6(() => {
    if (!open) return void 0;
    const opener = document.activeElement;
    const token = {};
    pila.push(token);
    const panel = panelRef.current;
    const iniziale = panel.querySelector("[data-autofocus]") || focusables(panel)[0] || panel;
    iniziale.focus();
    const onKey = (e) => {
      if (pila[pila.length - 1] !== token) return;
      if (e.key === "Escape") {
        if (e.defaultPrevented) return;
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const lista = focusables(panel);
      if (lista.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const primo = lista[0];
      const ultimo = lista[lista.length - 1];
      const attivo = document.activeElement;
      if (!panel.contains(attivo)) {
        e.preventDefault();
        primo.focus();
      } else if (e.shiftKey && attivo === primo) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && attivo === ultimo) {
        e.preventDefault();
        primo.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const i = pila.indexOf(token);
      if (i !== -1) pila.splice(i, 1);
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal2(
    /* @__PURE__ */ jsxs23("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: [
      /* @__PURE__ */ jsx28(
        "div",
        {
          "data-testid": "dialog-backdrop",
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm",
          onClick: closeOnBackdrop ? () => onClose?.() : void 0
        }
      ),
      /* @__PURE__ */ jsx28("div", { className: "flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6", children: /* @__PURE__ */ jsxs23(
        "div",
        {
          ref: panelRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          "aria-describedby": description ? descId : void 0,
          tabIndex: -1,
          className: cn(
            "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-2xl ring-1 ring-black/5 animate-fade-in focus:outline-none dark:ring-white/10",
            SIZES[size] ?? SIZES.sm,
            className
          ),
          children: [
            /* @__PURE__ */ jsxs23("div", { className: "flex items-start gap-3 border-b border-border px-6 py-4", children: [
              Icon && /* @__PURE__ */ jsx28("div", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15", children: /* @__PURE__ */ jsx28(Icon, { className: "h-5 w-5 text-primary", "aria-hidden": true }) }),
              /* @__PURE__ */ jsxs23("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx28(
                  "h2",
                  {
                    id: titleId,
                    className: "text-base font-semibold leading-tight text-foreground sm:text-lg",
                    children: title
                  }
                ),
                description && /* @__PURE__ */ jsx28("p", { id: descId, className: "mt-0.5 text-sm text-muted-foreground", children: description })
              ] }),
              /* @__PURE__ */ jsx28(
                IconButton_default,
                {
                  icon: X2,
                  label: "Chiudi",
                  size: "sm",
                  onClick: () => onClose?.(),
                  disabled: closeDisabled,
                  className: "-mr-1 -mt-1 shrink-0"
                }
              )
            ] }),
            /* @__PURE__ */ jsx28("div", { className: "flex-1 overflow-y-auto px-6 py-5", children }),
            footer && /* @__PURE__ */ jsx28("div", { className: "flex items-center justify-end gap-2 border-t border-border bg-muted/40 px-6 py-3", children: footer })
          ]
        }
      ) })
    ] }),
    document.body
  );
}

// src/organisms/ConfirmDialog.jsx
import { useEffect as useEffect7, useRef as useRef6, useState as useState7 } from "react";
import { Fragment as Fragment3, jsx as jsx29, jsxs as jsxs24 } from "react/jsx-runtime";
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  tone = "primary",
  requireText
}) {
  const inCorso = useRef6(false);
  const generazione = useRef6(0);
  const [loading, setLoading] = useState7(false);
  const [errore, setErrore] = useState7(null);
  const [testo, setTesto] = useState7("");
  useEffect7(() => {
    if (!open) {
      generazione.current += 1;
      inCorso.current = false;
      setLoading(false);
      setErrore(null);
      setTesto("");
    }
  }, [open]);
  const sbloccato = !requireText || testo.trim() === requireText;
  async function conferma() {
    if (inCorso.current || !sbloccato) return;
    const mia = generazione.current;
    inCorso.current = true;
    setLoading(true);
    setErrore(null);
    try {
      await onConfirm();
      if (mia === generazione.current) onClose();
    } catch (e) {
      if (mia === generazione.current)
        setErrore(
          typeof e === "string" && e ? e : e?.message || "Operazione non riuscita"
        );
    } finally {
      if (mia === generazione.current) {
        inCorso.current = false;
        setLoading(false);
      }
    }
  }
  const chiudi = () => {
    if (!inCorso.current) onClose();
  };
  return /* @__PURE__ */ jsx29(
    Dialog,
    {
      open,
      onClose: chiudi,
      title,
      size: "sm",
      closeOnBackdrop: !loading,
      closeDisabled: loading,
      footer: /* @__PURE__ */ jsxs24(Fragment3, { children: [
        /* @__PURE__ */ jsx29(Button_default, { variant: "outline", onClick: chiudi, disabled: loading, children: cancelLabel }),
        /* @__PURE__ */ jsx29(
          Button_default,
          {
            variant: tone === "danger" ? "destructive" : "primary",
            onClick: conferma,
            loading,
            disabled: !sbloccato,
            children: confirmLabel
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxs24("div", { className: "space-y-4 text-sm text-muted-foreground", children: [
        children,
        requireText && /* @__PURE__ */ jsx29(Field, { label: `Scrivi ${requireText} per confermare`, children: /* @__PURE__ */ jsx29(
          Input_default,
          {
            value: testo,
            onChange: (e) => setTesto(e.target.value),
            autoComplete: "off",
            disabled: loading,
            "data-autofocus": true
          }
        ) }),
        errore && /* @__PURE__ */ jsx29(Alert, { tone: "danger", children: errore })
      ] })
    }
  );
}

// src/organisms/Toast.jsx
import {
  createContext,
  useCallback as useCallback5,
  useContext,
  useEffect as useEffect8,
  useMemo as useMemo2,
  useRef as useRef7,
  useState as useState8
} from "react";
import { AlertTriangle as AlertTriangle2, CheckCircle2 as CheckCircle22, Info as Info2, X as X3, XCircle as XCircle2 } from "lucide-react";
import { jsx as jsx30, jsxs as jsxs25 } from "react/jsx-runtime";
var ToastContext = createContext(null);
var TONI2 = {
  success: {
    Icona: CheckCircle22,
    accent: "border-l-success",
    icon: TESTO.success
  },
  danger: {
    Icona: XCircle2,
    accent: "border-l-destructive",
    icon: TESTO.danger
  },
  warning: {
    Icona: AlertTriangle2,
    accent: "border-l-warning",
    icon: TESTO.warning
  },
  info: { Icona: Info2, accent: "border-l-info", icon: TESTO.info }
};
function ToastItem({ t, onDismiss }) {
  const s = TONI2[t.tone] ?? TONI2.info;
  return /* @__PURE__ */ jsxs25(
    "div",
    {
      className: cn(
        "pointer-events-auto flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border border-l-4 border-border bg-card p-3 text-card-foreground shadow-lg animate-slide-in",
        s.accent
      ),
      children: [
        /* @__PURE__ */ jsx30(s.Icona, { className: cn("mt-0.5 h-5 w-5 shrink-0", s.icon), "aria-hidden": true }),
        /* @__PURE__ */ jsxs25("div", { className: "min-w-0 flex-1 text-sm", children: [
          /* @__PURE__ */ jsx30("p", { className: "font-semibold", children: t.title }),
          t.description && /* @__PURE__ */ jsx30("p", { className: "mt-0.5 text-muted-foreground", children: t.description })
        ] }),
        /* @__PURE__ */ jsx30(
          IconButton_default,
          {
            icon: X3,
            label: "Chiudi notifica",
            size: "sm",
            onClick: () => onDismiss(t.id),
            className: "-my-1 -mr-1 shrink-0"
          }
        )
      ]
    }
  );
}
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState8([]);
  const timers = useRef7(/* @__PURE__ */ new Map());
  const seq = useRef7(0);
  const dismiss = useCallback5((id) => {
    setToasts((l) => l.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);
  const toast = useCallback5(
    ({ title, description, tone = "success", duration = 4e3 }) => {
      const id = ++seq.current;
      setToasts((l) => [...l, { id, title, description, tone }]);
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration)
        );
      }
      return id;
    },
    [dismiss]
  );
  useEffect8(() => {
    const attivi = timers.current;
    return () => {
      attivi.forEach(clearTimeout);
      attivi.clear();
    };
  }, []);
  const value = useMemo2(() => ({ toast, dismiss }), [toast, dismiss]);
  const urgenti = toasts.filter((t) => t.tone === "danger");
  const altri = toasts.filter((t) => t.tone !== "danger");
  return /* @__PURE__ */ jsxs25(ToastContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsxs25("div", { className: "pointer-events-none fixed right-4 top-4 z-[60] flex flex-col", children: [
      /* @__PURE__ */ jsx30("div", { "aria-live": "assertive", className: "flex flex-col gap-2", children: urgenti.map((t) => /* @__PURE__ */ jsx30(ToastItem, { t, onDismiss: dismiss }, t.id)) }),
      /* @__PURE__ */ jsx30(
        "div",
        {
          "aria-live": "polite",
          className: cn(
            "flex flex-col gap-2",
            urgenti.length > 0 && altri.length > 0 && "mt-2"
          ),
          children: altri.map((t) => /* @__PURE__ */ jsx30(ToastItem, { t, onDismiss: dismiss }, t.id))
        }
      )
    ] })
  ] });
}
function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// src/templates/AppShell.jsx
import {
  createContext as createContext2,
  useContext as useContext2,
  useEffect as useEffect9,
  useMemo as useMemo3,
  useRef as useRef8,
  useState as useState9
} from "react";
import { useLocation as useLocation2 } from "react-router-dom";
import { Menu } from "lucide-react";
import { Fragment as Fragment4, jsx as jsx31, jsxs as jsxs26 } from "react/jsx-runtime";
var STORAGE_KEY = "vuscom.sidebar.collapsed";
var WIDTHS = { "7xl": "max-w-7xl", full: "max-w-none" };
var NESSUNA_VOCE = [];
var CompattaContext = createContext2(null);
function useSidebarCompatta(attiva = true) {
  const richiedi = useContext2(CompattaContext);
  useEffect9(() => {
    if (!attiva || !richiedi) return void 0;
    return richiedi();
  }, [attiva, richiedi]);
}
function readCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}
function matches(node, pathname) {
  if (!node.to) return false;
  return node.to === "/" ? pathname === "/" : pathname === node.to || pathname.startsWith(`${node.to}/`);
}
function activeGroupIds(nodes, pathname) {
  const ids = [];
  for (const node of nodes) {
    if (!node?.children) continue;
    const inner = activeGroupIds(node.children, pathname);
    const hit = inner.length > 0 || node.children.some((c) => matches(c, pathname));
    if (hit) ids.push(node.id || node.label, ...inner);
  }
  return ids;
}
function AppShell({
  sidebar = {},
  topbarRight,
  azioniSidebar,
  maxWidth = "7xl",
  compattaAdOgniPagina = false,
  children
}) {
  const {
    nav = NESSUNA_VOCE,
    adminNav = NESSUNA_VOCE,
    ...sidebarProps
  } = sidebar;
  const { pathname } = useLocation2();
  useFaviconVuscom();
  const mainTree = useMemo3(() => normalizeNavTree(nav), [nav]);
  const adminTree = useMemo3(() => normalizeNavTree(adminNav), [adminNav]);
  const [collapsed, setCollapsed] = useState9(readCollapsed);
  const [richieste, setRichieste] = useState9(0);
  const [riaperta, setRiaperta] = useState9(false);
  const forzata = richieste > 0 && !riaperta;
  const richiediCompatta = useMemo3(
    () => () => {
      setRichieste((n) => n + 1);
      return () => setRichieste((n) => n - 1);
    },
    []
  );
  useEffect9(() => {
    if (richieste === 0) setRiaperta(false);
  }, [richieste]);
  const [apertaQui, setApertaQui] = useState9(false);
  const [isOpen, setIsOpen] = useState9(false);
  const [expanded, setExpanded] = useState9(
    () => new Set(activeGroupIds([...mainTree, ...adminTree], pathname))
  );
  const mainRef = useRef8(null);
  const treesRef = useRef8(null);
  treesRef.current = [...mainTree, ...adminTree];
  useEffect9(() => {
    const attivi = activeGroupIds(treesRef.current, pathname);
    if (attivi.length > 0)
      setExpanded(
        (prev) => attivi.every((id) => prev.has(id)) ? prev : /* @__PURE__ */ new Set([...prev, ...attivi])
      );
    if (mainRef.current) mainRef.current.scrollTop = 0;
    setApertaQui(false);
  }, [pathname]);
  const toggleCollapse = () => {
    if (compattaAdOgniPagina) {
      setApertaQui((v) => !v);
      return;
    }
    if (forzata) {
      setRiaperta(true);
      if (!collapsed) return;
    }
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
      }
      return next;
    });
  };
  const toggleGroup = (id) => setExpanded((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const compressa = compattaAdOgniPagina ? !apertaQui : collapsed || forzata;
  const azioni = typeof azioniSidebar === "function" ? azioniSidebar({ compressa }) : azioniSidebar;
  return /* @__PURE__ */ jsx31(CompattaContext.Provider, { value: richiediCompatta, children: /* @__PURE__ */ jsxs26("div", { className: "flex h-screen bg-app", children: [
    /* @__PURE__ */ jsx31(
      AppSidebar,
      {
        ...sidebarProps,
        mainTree,
        adminTree,
        expandedGroups: expanded,
        onToggleGroup: toggleGroup,
        isOpen,
        onClose: () => setIsOpen(false),
        collapsed: compressa,
        onToggleCollapse: toggleCollapse,
        footerSlot: azioni && !compressa ? /* @__PURE__ */ jsxs26(Fragment4, { children: [
          sidebarProps.footerSlot,
          azioni
        ] }) : sidebarProps.footerSlot,
        themeSlot: azioni && compressa ? (
          // Collapsed (60px): no footer rows, so it stacks over the toggle.
          /* @__PURE__ */ jsxs26("div", { className: "flex flex-col items-center gap-1.5", children: [
            azioni,
            /* @__PURE__ */ jsx31(ThemeToggle, {})
          ] })
        ) : /* @__PURE__ */ jsx31(ThemeToggle, {}),
        navClassName: "scrollbar-thin"
      }
    ),
    /* @__PURE__ */ jsxs26("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxs26("header", { className: "flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur", children: [
        /* @__PURE__ */ jsx31(
          IconButton_default,
          {
            icon: Menu,
            label: "Apri menu",
            className: "md:hidden",
            onClick: () => setIsOpen(true)
          }
        ),
        /* @__PURE__ */ jsx31("div", { className: "ml-auto flex items-center gap-2", children: topbarRight })
      ] }),
      /* @__PURE__ */ jsx31(
        "main",
        {
          ref: mainRef,
          className: "flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6",
          children: /* @__PURE__ */ jsx31("div", { className: cn("mx-auto", WIDTHS[maxWidth] ?? WIDTHS["7xl"]), children })
        }
      )
    ] })
  ] }) });
}

// src/templates/PageHeader.jsx
import { BookOpen } from "lucide-react";
import { jsx as jsx32, jsxs as jsxs27 } from "react/jsx-runtime";
function PageHeader({
  title,
  description,
  icon: Icon,
  help,
  helpHref,
  actions,
  tabs,
  className
}) {
  return /* @__PURE__ */ jsxs27("div", { className: cn("mb-6 space-y-4", className), children: [
    /* @__PURE__ */ jsxs27("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
      /* @__PURE__ */ jsxs27("div", { className: "min-w-0 space-y-1", children: [
        /* @__PURE__ */ jsxs27("div", { className: "flex items-center gap-2", children: [
          Icon && /* @__PURE__ */ jsx32(Icon, { className: "h-6 w-6 text-primary", "aria-hidden": true }),
          /* @__PURE__ */ jsx32("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
          help && /* @__PURE__ */ jsx32(InfoTip, { children: help }),
          helpHref && /* @__PURE__ */ jsxs27(
            "a",
            {
              href: helpHref,
              className: "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              children: [
                /* @__PURE__ */ jsx32(BookOpen, { className: "h-3.5 w-3.5", "aria-hidden": true }),
                "Guida"
              ]
            }
          )
        ] }),
        description && /* @__PURE__ */ jsx32("p", { className: "text-muted-foreground", children: description })
      ] }),
      actions && /* @__PURE__ */ jsx32("div", { className: "flex shrink-0 flex-wrap items-center gap-2", children: actions })
    ] }),
    tabs
  ] });
}

// src/templates/Section.jsx
import { jsx as jsx33, jsxs as jsxs28 } from "react/jsx-runtime";
function Section({
  title,
  description,
  actions,
  className,
  children
}) {
  return /* @__PURE__ */ jsxs28("section", { className: cn("space-y-3", className), children: [
    (title || description || actions) && /* @__PURE__ */ jsxs28("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs28("div", { className: "min-w-0", children: [
        title && /* @__PURE__ */ jsx33("h2", { className: "text-lg font-semibold", children: title }),
        description && /* @__PURE__ */ jsx33("p", { className: "text-sm text-muted-foreground", children: description })
      ] }),
      actions && /* @__PURE__ */ jsx33("div", { className: "flex shrink-0 items-center gap-2", children: actions })
    ] }),
    children
  ] });
}

// src/templates/LoginPage.jsx
import { useId as useId8, useState as useState11 } from "react";
import { Eye, EyeOff } from "lucide-react";

// src/accesso/useAccessoMicrosoft.js
import { useCallback as useCallback6, useEffect as useEffect10, useState as useState10 } from "react";
var BASE_MICROSOFT = "/api/auth/microsoft";
var MESSAGGI_ERRORE_MICROSOFT = {
  annullato: "Accesso con Microsoft annullato.",
  scaduto: "La richiesta di accesso \xE8 scaduta: riprova.",
  non_abilitato: "Il tuo account Microsoft non \xE8 abilitato a questo portale. Chiedi l'accesso a un amministratore.",
  errore: "Accesso con Microsoft non riuscito. Riprova o usa la password."
};
function leggiFrammento() {
  if (typeof window === "undefined") return {};
  const frammento = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const biglietto = frammento.get("microsoft");
  const errore = frammento.get("microsoft_errore");
  if (biglietto || errore) {
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, "", pathname + search);
  }
  return { biglietto, errore };
}
function useAccessoMicrosoft({ base = BASE_MICROSOFT, onAccesso } = {}) {
  const [disponibile, setDisponibile] = useState10(false);
  const [inCorso, setInCorso] = useState10(false);
  const [errore, setErrore] = useState10("");
  useEffect10(() => {
    let attivo = true;
    const { biglietto, errore: codice } = leggiFrammento();
    if (codice) {
      setErrore(MESSAGGI_ERRORE_MICROSOFT[codice] || MESSAGGI_ERRORE_MICROSOFT.errore);
    }
    if (biglietto) {
      setInCorso(true);
      (async () => {
        try {
          const res = await fetch(`${base}/scambia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ biglietto })
          });
          const dati = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(
              typeof dati?.detail === "string" ? dati.detail : MESSAGGI_ERRORE_MICROSOFT.errore
            );
          }
          await onAccesso?.(dati);
        } catch (err) {
          if (attivo) setErrore(err?.message || MESSAGGI_ERRORE_MICROSOFT.errore);
        } finally {
          if (attivo) setInCorso(false);
        }
      })();
    }
    (async () => {
      try {
        const res = await fetch(`${base}/disponibile`);
        const dati = res.ok ? await res.json() : {};
        if (attivo) setDisponibile(dati?.disponibile === true);
      } catch {
        if (attivo) setDisponibile(false);
      }
    })();
    return () => {
      attivo = false;
    };
  }, [base]);
  const accedi = useCallback6(() => {
    setInCorso(true);
    window.location.assign(`${base}/login`);
  }, [base]);
  return { disponibile, inCorso, errore, accedi };
}

// src/accesso/AccessoMicrosoft.jsx
import { Fragment as Fragment5, jsx as jsx34, jsxs as jsxs29 } from "react/jsx-runtime";
function LogoMicrosoft() {
  return /* @__PURE__ */ jsxs29("svg", { viewBox: "0 0 21 21", className: "h-4 w-4", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx34("rect", { x: "1", y: "1", width: "9", height: "9", fill: "#f25022" }),
    /* @__PURE__ */ jsx34("rect", { x: "11", y: "1", width: "9", height: "9", fill: "#7fba00" }),
    /* @__PURE__ */ jsx34("rect", { x: "1", y: "11", width: "9", height: "9", fill: "#00a4ef" }),
    /* @__PURE__ */ jsx34("rect", { x: "11", y: "11", width: "9", height: "9", fill: "#ffb900" })
  ] });
}
function AccessoMicrosoft({ base = BASE_MICROSOFT, onAccesso, className }) {
  const { disponibile, inCorso, errore, accedi } = useAccessoMicrosoft({ base, onAccesso });
  if (!disponibile && !errore && !inCorso) return null;
  return /* @__PURE__ */ jsxs29("div", { className: cn("space-y-4", className), children: [
    errore && /* @__PURE__ */ jsx34(Alert, { tone: "danger", children: errore }),
    (disponibile || inCorso) && /* @__PURE__ */ jsxs29(Fragment5, { children: [
      /* @__PURE__ */ jsxs29("div", { className: "flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground", children: [
        /* @__PURE__ */ jsx34("span", { className: "h-px flex-1 bg-border" }),
        "oppure",
        /* @__PURE__ */ jsx34("span", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsx34(
        Button_default,
        {
          type: "button",
          variant: "outline",
          size: "lg",
          fullWidth: true,
          loading: inCorso,
          icon: LogoMicrosoft,
          onClick: accedi,
          children: "Accedi con Microsoft"
        }
      )
    ] })
  ] });
}

// src/templates/LoginPage.jsx
import { jsx as jsx35, jsxs as jsxs30 } from "react/jsx-runtime";
function LoginPage({
  title,
  subtitle = "Accedi al tuo account",
  logoLight = LOGHI_VUSCOM.marchioChiaro,
  logoDark = LOGHI_VUSCOM.marchioScuro,
  onSubmit,
  usernameLabel = "Username o email",
  footer = "\xA9 VUS COM SRL",
  microsoft
}) {
  const passwordId = useId8();
  useFaviconVuscom();
  const [username, setUsername] = useState11("");
  const [password, setPassword] = useState11("");
  const [show, setShow] = useState11(false);
  const [loading, setLoading] = useState11(false);
  const [error, setError] = useState11("");
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(username, password);
    } catch (err) {
      setError(err?.message || "Accesso non riuscito");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs30("div", { className: "relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 px-4 dark:from-slate-900 dark:to-slate-800", children: [
    /* @__PURE__ */ jsx35("div", { className: "absolute right-4 top-4", children: /* @__PURE__ */ jsx35(ThemeToggle, {}) }),
    /* @__PURE__ */ jsxs30("div", { className: "w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-2xl", children: [
      /* @__PURE__ */ jsxs30("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx35(
          "img",
          {
            src: logoLight,
            alt: "VUS COM",
            className: "mx-auto h-20 w-auto object-contain dark:hidden"
          }
        ),
        /* @__PURE__ */ jsx35(
          "img",
          {
            src: logoDark,
            alt: "VUS COM",
            className: "mx-auto hidden h-20 w-auto object-contain dark:block"
          }
        ),
        /* @__PURE__ */ jsx35("h1", { className: "mt-6 text-3xl font-bold text-foreground", children: title }),
        /* @__PURE__ */ jsx35("p", { className: "mt-2 text-sm text-muted-foreground", children: subtitle })
      ] }),
      /* @__PURE__ */ jsxs30("form", { className: "space-y-5", onSubmit: handleSubmit, children: [
        error && /* @__PURE__ */ jsx35(Alert, { tone: "danger", children: error }),
        /* @__PURE__ */ jsx35(Field, { label: usernameLabel, children: /* @__PURE__ */ jsx35(
          Input_default,
          {
            name: "username",
            autoComplete: "username",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            required: true
          }
        ) }),
        /* @__PURE__ */ jsxs30("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx35(
            "label",
            {
              htmlFor: passwordId,
              className: "text-sm font-medium text-foreground",
              children: "Password"
            }
          ),
          /* @__PURE__ */ jsxs30("div", { className: "relative", children: [
            /* @__PURE__ */ jsx35(
              Input_default,
              {
                id: passwordId,
                name: "password",
                type: show ? "text" : "password",
                autoComplete: "current-password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                className: "pr-11",
                required: true
              }
            ),
            /* @__PURE__ */ jsx35(
              IconButton_default,
              {
                icon: show ? EyeOff : Eye,
                label: show ? "Nascondi password" : "Mostra password",
                size: "sm",
                className: "absolute right-1 top-1",
                onClick: () => setShow((s) => !s)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx35(Button_default, { type: "submit", size: "lg", fullWidth: true, loading, children: "Accedi" })
      ] }),
      microsoft && /* @__PURE__ */ jsx35(AccessoMicrosoft, { ...microsoft }),
      footer && /* @__PURE__ */ jsx35("div", { className: "text-center text-xs text-muted-foreground", children: footer })
    ] })
  ] });
}
export {
  AccessoMicrosoft,
  Alert,
  AppShell,
  AppSidebar,
  BASE_MICROSOFT,
  Badge,
  Button_default as Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Dialog,
  EmptyState,
  Field,
  IconButton_default as IconButton,
  InfoTip,
  Input_default as Input,
  Kbd,
  KpiCard,
  LOGHI_VUSCOM,
  LoginPage,
  LogoV,
  MESSAGGI_ERRORE_MICROSOFT,
  MarchioVuscom,
  PageHeader,
  Pagination,
  ProgressBar,
  Section,
  SegmentedControl,
  Select,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonText,
  Spinner,
  StatusDot,
  THEME_INIT_SCRIPT,
  Tabs,
  Textarea_default as Textarea,
  ThemeToggle,
  ToastProvider,
  Toggle,
  Tooltip,
  cn,
  collectGroupIds,
  formatData,
  formatDataOra,
  formatNumero,
  formatRelativo,
  normalizeNavTree,
  useAccessoMicrosoft,
  useFaviconVuscom,
  useSidebarCompatta,
  useSort,
  useTabIds,
  useTheme,
  useToast
};
