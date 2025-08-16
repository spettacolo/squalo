"use client";

import React from "react";

type Particle = {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  opacity: number;
};

type Props = {
  variant?: "bubbles" | "stars";
  count?: number;
  className?: string;
};

export class ParticleBackground extends React.PureComponent<
  Props,
  { particles: Particle[] }
> {
  static defaultProps: Partial<Props> = {
    variant: "bubbles",
    count: 18,
  };

  state = {
    // start empty on server; populate on client in componentDidMount to avoid SSR/client mismatch
    particles: [] as Particle[],
  };

  renderBubble(p: Particle) {
    const wrapStyle: React.CSSProperties = {
      left: p.left,
      width: `${p.size}px`,
      height: `${p.size}px`,
      bottom: -p.size,
      position: "absolute",
      // loop the rise animation so bubbles reappear continuously
      animation: `rise ${p.duration}s linear ${p.delay}s infinite`,
      pointerEvents: "none",
    };

    const innerStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      background: `rgba(255,255,255,${p.opacity})`,
      transform: "translateX(0)",
      // sway animation uses --sway variable
      animation: `sway ${Math.max(3, p.duration / 2)}s ease-in-out ${p.delay}s infinite`,
      // expose CSS var for sway amplitude
      ["--sway" as any]: `${p.sway}px`,
    };

    return (
      <div key={p.id} className="particle-wrap" style={wrapStyle} aria-hidden>
        <div className="particle" style={innerStyle} />
      </div>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`particle-container ${className ?? ""}`} aria-hidden>
        {this.state.particles.map((p) => this.renderBubble(p))}
      </div>
    );
  }

  componentDidMount() {
    // generate particles only on client after mount
    const count = this.props.count ?? 18;
    const particles = Array.from({ length: count }).map((_, i) => {
      const left = Math.round(Math.random() * 100) + "%";
      const size = Math.round(8 + Math.random() * 34); // px
      const duration = Number((6 + Math.random() * 12).toFixed(2));
      const delay = Number((Math.random() * -duration).toFixed(2));
      const sway = Math.round(12 + Math.random() * 80) * (Math.random() < 0.5 ? -1 : 1);
      const opacity = Number((0.04 + Math.random() * 0.16).toFixed(2));
      return { id: i, left, size, duration, delay, sway, opacity };
    });
    this.setState({ particles });
  }
}

export default ParticleBackground;
