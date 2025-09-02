import React from 'react';

function Section({ id, title, children }) {
  return (
    <section id={id} className="section mb-4" data-animate>
      <h2 className="h4 mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-4">
        <div className="sticky-top" style={{ top: 84 }}>
          <div className="card card-hover mb-3">
            <div className="card-body d-flex align-items-center gap-3">
              <span className="avatar-frame">
                <img className="avatar photo" src="/assets/avatar.svg" alt="Profile" width="64" height="64" />
              </span>
              <div>
                <div className="fw-semibold">Nguyễn Minh Trí</div>
                <div className="text-secondary small d-flex align-items-center gap-2"><i className="bi bi-geo-alt"></i> Ho Chi Minh City, VN</div>
              </div>
            </div>
          </div>
          <div className="card card-hover mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-semibold">On GitHub</div>
                <a className="text-decoration-none small" href="https://github.com/mihtriii" target="_blank" rel="noopener">View →</a>
              </div>
              <p className="mb-0 text-secondary small">Recent work and repositories.</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="col-12 col-lg-8">
        <section className="page-hero p-4 mb-3" data-animate>
          <div className="row align-items-center g-4">
            <div className="col-12 col-md-7">
              <h1 className="h3 mb-1"><span className="gradient-text">Hi, I’m Trí.</span></h1>
              <p className="text-secondary mb-3">AI @ FPTU HCM — Computer Vision, Vision‑Language Models, and Quantum ML.</p>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge text-bg-primary">Computer Vision</span>
                <span className="badge text-bg-primary">VLMs</span>
                <span className="badge text-bg-primary">Quantum ML</span>
              </div>
            </div>
            <div className="col-12 col-md-5 text-center">
              <img className="img-fluid rounded shadow-sm" src="/assets/avatar.svg" alt="Portrait" style={{ maxHeight: 200 }} />
            </div>
          </div>
        </section>

        <Section id="about" title="About">
          <p>I’m an AI student who learns by building. I enjoy working at the intersection of <strong>Computer Vision</strong> and <strong>Vision‑Language Models</strong>, and I’m exploring <strong>Quantum ML</strong> for vision as a long‑term research direction. I value clarity, simple baselines, and reproducible demos that make ideas tangible.</p>
          <p>Right now, I’m focused on practical VLM applications (retrieval, grounding, instruction‑tuning) and setting up strong habits for research: reading, small experiments, and writing. I’m open to collaborations that are lightweight, focused, and shipping‑oriented.</p>
        </Section>

        <Section id="focus" title="Research Focus">
          <ul className="mb-0">
            <li><strong>Vision‑Language</strong>: multimodal retrieval, visual grounding, instruction tuning, evaluation.</li>
            <li><strong>Applied VLMs</strong>: edge or cloud deployment with latency/throughput trade‑offs.</li>
            <li><strong>Quantum for Vision</strong>: hybrid classical‑quantum training and simple QML baselines.</li>
          </ul>
        </Section>

        <Section id="goals" title="Near‑term Goals (2024–2026)">
          <ul className="mb-0">
            <li>Target one <strong>A*</strong> conference‑level paper by end of sophomore year.</li>
            <li>Attend/participate in relevant CV/ML conferences and workshops.</li>
          </ul>
        </Section>

        <Section id="tech" title="Technologies">
          <div className="row g-3 row-cols-1 row-cols-md-3">
            <div className="col">
              <div className="card card-hover h-100">
                <div className="card-body">
                  <h3 className="h6 mb-2">Core</h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-secondary">Python</span>
                    <span className="badge text-bg-secondary">C++</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card card-hover h-100">
                <div className="card-body">
                  <h3 className="h6 mb-2">ML/CV</h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-secondary">PyTorch</span>
                    <span className="badge text-bg-secondary">OpenCV</span>
                    <span className="badge text-bg-secondary">Transformers</span>
                    <span className="badge text-bg-secondary">timm</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card card-hover h-100">
                <div className="card-body">
                  <h3 className="h6 mb-2">Tooling</h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-secondary">Git/GitHub</span>
                    <span className="badge text-bg-secondary">Linux</span>
                    <span className="badge text-bg-secondary">LaTeX/Overleaf</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects" title="Projects (Planned)">
          <ul className="mb-0">
            <li>Mini‑VLM Playground — small‑scale retrieval/grounding demos with benchmarks.</li>
            <li>QML for Vision — hybrid quantum‑classical baselines on MNIST/CIFAR.</li>
            <li>Edge‑friendly CV — distilled/quantized models for edge inference.</li>
          </ul>
        </Section>

        <Section id="contact" title="Contact">
          <p className="mb-0"><a href="mailto:mihtriii295@gmail.com">mihtriii295@gmail.com</a></p>
        </Section>
      </div>
    </div>
  );
}

