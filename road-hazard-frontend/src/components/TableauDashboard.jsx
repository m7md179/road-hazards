import { useEffect, useRef } from "react";

const TableauDashboard = () => {
  const vizRef = useRef(null);

  useEffect(() => {
    const loadViz = () => {
      const divElement = document.getElementById("viz1747774410913");
      const vizElement = divElement.getElementsByTagName("object")[0];

      if (divElement.offsetWidth > 800) {
        vizElement.style.minWidth = "800px";
        vizElement.style.maxWidth = "1200px";
        vizElement.style.width = "100%";
        vizElement.style.height = "600px"; // Increased for better visibility
      } else if (divElement.offsetWidth > 500) {
        vizElement.style.minWidth = "800px";
        vizElement.style.maxWidth = "1200px";
        vizElement.style.width = "100%";
        vizElement.style.height = "600px";
      } else {
        vizElement.style.width = "100%";
        vizElement.style.height = "600px";
      }

      const scriptElement = document.createElement("script");
      scriptElement.src =
        "https://public.tableau.com/javascripts/api/viz_v1.js";
      vizElement.parentNode.insertBefore(scriptElement, vizElement);
    };

    loadViz();

    return () => {
      // Cleanup if needed
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
        height: "650px", // Fixed height for container
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
        id="viz1747774410913"
        style={{ position: "relative" }}
        ref={vizRef}
      >
        <noscript>
          <a href="#">
            <img
              alt="Statistics"
              src="https://public.tableau.com/static/images/Gr/GraduationProjectDashboardLatestVersion/Statistics/1_rss.png"
              style={{ border: "none" }}
            />
          </a>
        </noscript>
        <object className="tableauViz" style={{ display: "none" }}>
          <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
          <param name="embed_code_version" value="3" />
          <param name="site_root" value="" />
          <param
            name="name"
            value="GraduationProjectDashboardLatestVersion/Statistics"
          />
          <param name="tabs" value="no" />
          <param name="toolbar" value="yes" />
          <param
            name="static_image"
            value="https://public.tableau.com/static/images/Gr/GraduationProjectDashboardLatestVersion/Statistics/1.png"
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

export default TableauDashboard;
