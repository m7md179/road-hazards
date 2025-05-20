import { useEffect, useRef } from "react";

const TableauGraphs = () => {
  const vizRef = useRef(null);

  useEffect(() => {
    const loadViz = () => {
      const divElement = document.getElementById("viz1747774729930");
      const vizElement = divElement.getElementsByTagName("object")[0];

      if (divElement.offsetWidth > 800) {
        vizElement.style.width = "100%";
        vizElement.style.height = divElement.offsetWidth * 0.75 + "px";
      } else if (divElement.offsetWidth > 500) {
        vizElement.style.width = "100%";
        vizElement.style.height = divElement.offsetWidth * 0.75 + "px";
      } else {
        vizElement.style.width = "100%";
        vizElement.style.height = "1027px";
      }

      const scriptElement = document.createElement("script");
      scriptElement.src =
        "https://public.tableau.com/javascripts/api/viz_v1.js";
      vizElement.parentNode.insertBefore(scriptElement, vizElement);
    };

    loadViz();

    return () => {
      const scriptElements = document.querySelectorAll(
        'script[src*="tableau"]'
      );
      scriptElements.forEach((script) => script.remove());
    };
  }, []);

  return (
    <div
      className="tableau-container"
      style={{
        width: "95%",
        height: "auto",
        overflow: "auto",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="tableauPlaceholder"
        id="viz1747774729930"
        style={{ position: "relative" }}
        ref={vizRef}
      >
        <noscript>
          <a href="#">
            <img
              alt="Graphs / Visuals"
              src="https://public.tableau.com/static/images/H5/H5KJ8H92P/1_rss.png"
              style={{ border: "none" }}
            />
          </a>
        </noscript>
        <object className="tableauViz" style={{ display: "none" }}>
          <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
          <param name="embed_code_version" value="3" />
          <param name="path" value="shared/H5KJ8H92P" />
          <param name="toolbar" value="yes" />
          <param
            name="static_image"
            value="https://public.tableau.com/static/images/H5/H5KJ8H92P/1.png"
          />
          <param name="animate_transition" value="yes" />
          <param name="display_static_image" value="yes" />
          <param name="display_spinner" value="yes" />
          <param name="display_overlay" value="yes" />
          <param name="display_count" value="yes" />
          <param name="language" value="en-US" />
          <param name="filter" value="publish=yes" />
        </object>
      </div>
    </div>
  );
};

export default TableauGraphs;
