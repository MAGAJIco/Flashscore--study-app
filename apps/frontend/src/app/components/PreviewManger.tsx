"use client";
import React, { useState, useEffect } from "react";
import PredictionPreview from "./PredictionPreview";

interface PreviewItem {
  id: string;
  type: "prediction" | "match" | "analysis";
  title: string;
  content: any;
  timestamp: Date;
}

const PreviewManager: React.FC = () => {
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [activePreview, setActivePreview] = useState<PreviewItem | null>(null);
  const [previewMode, setPreviewMode] = useState<
    "grid" | "carousel" | "single"
  >("grid");

  useEffect(() => {
    loadPreviews();
  }, []);

  const loadPreviews = () => {
    // Mock preview data - replace with actual API calls
    const mockPreviews: PreviewItem[] = [
      {
        id: "1",
        type: "prediction",
        title: "Manchester United vs Liverpool",
        content: {
          match: "Manchester United vs Liverpool",
          prediction: "Liverpool Win",
          confidence: 78.5,
          sport: "Football",
          odds: "2.1",
          status: "pending",
          aiScore: 91.2,
          analysis: "Liverpool shows superior form with recent wins.",
          riskLevel: "medium",
          expectedValue: 1.65,
        },
        timestamp: new Date(),
      },
      {
        id: "2",
        type: "prediction",
        title: "Lakers vs Warriors",
        content: {
          match: "Lakers vs Warriors",
          prediction: "Lakers Win",
          confidence: 82.3,
          sport: "Basketball",
          odds: "1.9",
          status: "pending",
          aiScore: 88.7,
          analysis: "Lakers home advantage and recent form favor victory.",
          riskLevel: "low",
          expectedValue: 1.56,
        },
        timestamp: new Date(),
      },
      {
        id: "3",
        type: "prediction",
        title: "Chiefs vs Bills",
        content: {
          match: "Chiefs vs Bills",
          prediction: "Over 48.5 Points",
          confidence: 85.1,
          sport: "American Football",
          odds: "1.8",
          status: "pending",
          aiScore: 93.4,
          analysis: "Both teams averaging high scoring games this season.",
          riskLevel: "low",
          expectedValue: 1.53,
        },
        timestamp: new Date(),
      },
    ];

    setPreviews(mockPreviews);
    if (mockPreviews.length > 0) {
      setActivePreview(mockPreviews[0]);
    }
  };

  const renderGridView = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px",
      }}
    >
      {previews.map((preview) => (
        <div
          key={preview.id}
          onClick={() => setActivePreview(preview)}
          style={{ cursor: "pointer" }}
        >
          <PredictionPreview prediction={preview.content} compact={true} />
        </div>
      ))}
    </div>
  );

  const renderCarouselView = () => (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "20px",
        padding: "10px 0",
        scrollBehavior: "smooth",
      }}
    >
      {previews.map((preview) => (
        <div
          key={preview.id}
          style={{ minWidth: "350px", flex: "0 0 auto" }}
          onClick={() => setActivePreview(preview)}
        >
          <PredictionPreview prediction={preview.content} compact={false} />
        </div>
      ))}
    </div>
  );

  const renderSingleView = () => (
    <div>
      {activePreview && (
        <PredictionPreview
          prediction={activePreview.content}
          showFullAnalysis={true}
        />
      )}

      {previews.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {previews.map((preview, index) => (
            <button
              key={preview.id}
              onClick={() => setActivePreview(preview)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background:
                  activePreview?.id === preview.id
                    ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                    : "rgba(255, 255, 255, 0.1)",
                color: "white",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "2rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #00ff88, #00a2ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🔮 Preview Center
        </h1>

        <div style={{ display: "flex", gap: "8px" }}>
          {["grid", "carousel", "single"].map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode as any)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background:
                  previewMode === mode
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : "rgba(255, 255, 255, 0.1)",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(15px)",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
            Total Previews
          </div>
          <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "700" }}>
            {previews.length}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(15px)",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
            Avg Confidence
          </div>
          <div
            style={{ color: "#22c55e", fontSize: "1.8rem", fontWeight: "700" }}
          >
            {previews.length > 0
              ? Math.round(
                  previews.reduce(
                    (sum, p) => sum + (p.content.confidence || 0),
                    0,
                  ) / previews.length,
                )
              : 0}
            %
          </div>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(15px)",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
            High Confidence
          </div>
          <div
            style={{ color: "#fbbf24", fontSize: "1.8rem", fontWeight: "700" }}
          >
            {previews.filter((p) => (p.content.confidence || 0) > 80).length}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div>
        {previewMode === "grid" && renderGridView()}
        {previewMode === "carousel" && renderCarouselView()}
        {previewMode === "single" && renderSingleView()}
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={loadPreviews}
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 auto",
          }}
        >
          🔄 Refresh Previews
        </button>
      </div>
    </div>
  );
};

export default PreviewManager;
