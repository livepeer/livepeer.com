import { useState } from "react";
import { Calculator, Preview } from "./pricingCalculatorComponents";

const PricingCalculator = () => {
  const [streamLength, setStreamLength] = useState<number>(0);
  const [monthlyStreams, setMonthlyStreams] = useState<number>(0);
  const [viewCount, setViewCount] = useState<number>(0);
  const [percentageWatched, setPercentageWatched] = useState<number>(0);

  const transcoding = (streamLength / 60) * monthlyStreams * 0.005;

  const streaming =
    ((((60 * (streamLength / 60) * monthlyStreams * 10000) / 8) / 1024) / 1024) *
    viewCount *
    percentageWatched *
    0.01;

  return (
    <div sx={{ display: "flex", flexDirection: "column", mt: "144px" }}>
      <h1
        sx={{
          fontSize: [5, 5, 6],
          mb: "16px",
          textAlign: "center",
          letterSpacing: "-0.04em",
        }}>
        Estimate your monthly costs
      </h1>
      <p
        sx={{
          mb: "64px",
          fontSize: ["20px", "24px"],
          lineHeight: "29px",
          letterSpacing: "-0.02em",
          alignSelf: "center",
          textAlign: "center",
        }}>
        Add details about your content and audience
      </p>
      <div
        sx={{
          display: "grid",
          gridTemplateColumns: ["1fr", "40% 48%"],
          gap: ["40px", "12%"],
          maxWidth: "100%",
        }}>
        <Calculator
          streamLength={streamLength}
          monthlyStreams={monthlyStreams}
          viewCount={viewCount}
          setViewCount={setViewCount}
          setMonthlyStreams={setMonthlyStreams}
          setStreamLength={setStreamLength}
          percentageWatched={percentageWatched}
          setPercentageWatched={setPercentageWatched}
        />
        <Preview transcoding={transcoding} streaming={streaming} />
      </div>
    </div>
  );
};

export default PricingCalculator;
