import "../styles/loader.css";

export default function FullScreenLoader() {
  return (
    <div className="tii-loader">
      <div className="loader">

        <div className="stage">
          <div className="ring-rotate">
            <div className="ring" />
          </div>

          <div className="tii">TII</div>

          <div className="bubble b1" style={{ "--x": ".2", "--y": ".1" } as any} />
          <div className="bubble b2" style={{ "--x": ".7", "--y": ".3" } as any} />
          <div className="bubble b3" style={{ "--x": ".4", "--y": ".8" } as any} />
          <div className="bubble b4" style={{ "--x": ".9", "--y": ".5" } as any} />
        </div>

        <div className="loading-text">
          {"Innovation Loading".split("").map((c, i) => (
            <span key={i} style={{ "--i": i } as any}>{c}</span>
          ))}
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>

      </div>
    </div>
  );
}
