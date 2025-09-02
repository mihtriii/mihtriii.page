import React from 'react';

function Section({ title, children }) {
  return (
    <section className="section mb-4" data-animate>
      <h2 className="h4">{title}</h2>
      {children}
    </section>
  );
}

export default function CV() {
  return (
    <div>
      <section className="page-hero p-4 mb-3" data-animate>
        <h1 className="h3 mb-1"><span className="gradient-text">Curriculum Vitae</span></h1>
        <p className="text-secondary mb-0">Nguyễn Minh Trí · AI Student · FPTU HCM</p>
      </section>

      <Section title="Education">
        <div className="d-flex justify-content-between gap-3 align-items-baseline">
          <div><strong>FPT University Ho Chi Minh City (FPTU HCM)</strong> — BSc in Artificial Intelligence (K20)</div>
          <div className="text-secondary small">2024 – present</div>
        </div>
      </Section>

      <Section title="Experience">
        <div className="mb-3">
          <div className="d-flex justify-content-between gap-3 align-items-baseline">
            <div><strong>AI Research Intern</strong> — AITA LAB, FPTU HCM</div>
            <div className="text-secondary small">2025 – present</div>
          </div>
          <ul className="mb-0">
            <li>Early‑stage research exposure in Computer Vision and QML.</li>
            <li>Literature review, prototyping, and small‑scale experiments.</li>
          </ul>
        </div>
      </Section>

      <Section title="Research Interests">
        <ul className="mb-0">
          <li>Vision‑Language Models: retrieval, grounding, instruction tuning, evaluation.</li>
          <li>Applied VLMs: deployment on edge/cloud with performance trade‑offs.</li>
          <li>Quantum ML: hybrid classical‑quantum methods for vision tasks.</li>
        </ul>
      </Section>

      <Section title="Competitions & Activities">
        <ul className="mb-0">
          <li>AIoT on Edge Hackathon (2025) — explored lightweight CV/VLM on edge.</li>
          <li>VOI 2024 — Consolation Prize (Khuyến khích).</li>
          <li>Campus: GDG on Campus, student tech communities, academic seminars.</li>
        </ul>
      </Section>

      <Section title="Skills">
        <div className="row g-3 row-cols-1 row-cols-md-2">
          <div className="col">
            <div className="card h-100"><div className="card-body">
              <h3 className="h6">Programming</h3>
              <div className="d-flex gap-2 flex-wrap"><span className="badge text-bg-secondary">C++</span> <span className="badge text-bg-secondary">Python</span></div>
            </div></div>
          </div>
          <div className="col">
            <div className="card h-100"><div className="card-body">
              <h3 className="h6">ML/CV</h3>
              <div className="d-flex gap-2 flex-wrap"><span className="badge text-bg-secondary">PyTorch</span> <span className="badge text-bg-secondary">OpenCV</span> <span className="badge text-bg-secondary">Transformers (learning)</span> <span className="badge text-bg-secondary">timm (learning)</span></div>
            </div></div>
          </div>
          <div className="col">
            <div className="card h-100"><div className="card-body">
              <h3 className="h6">Quantum</h3>
              <div className="d-flex gap-2 flex-wrap"><span className="badge text-bg-secondary">Qiskit</span> <span className="badge text-bg-secondary">PennyLane</span> <span className="badge text-bg-secondary">Hybrid training</span></div>
            </div></div>
          </div>
          <div className="col">
            <div className="card h-100"><div className="card-body">
              <h3 className="h6">Tooling</h3>
              <div className="d-flex gap-2 flex-wrap"><span className="badge text-bg-secondary">Git/GitHub</span> <span className="badge text-bg-secondary">Linux CLI</span> <span className="badge text-bg-secondary">LaTeX/Overleaf</span></div>
            </div></div>
          </div>
        </div>
      </Section>

      <Section title="Projects (Planned)">
        <ul className="mb-0">
          <li>Mini‑VLM Playground — small‑scale retrieval/grounding demos with benchmarks.</li>
          <li>QML for Vision — hybrid quantum‑classical baselines on MNIST/CIFAR.</li>
          <li>Edge‑friendly CV — distilled/quantized models for edge inference.</li>
        </ul>
      </Section>
    </div>
  );
}

