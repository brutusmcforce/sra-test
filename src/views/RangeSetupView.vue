<script setup lang="ts">
const exercises = [
  { n: "1", label: "10 m", boxes: "E", note: "Stående grundställning." },
  { n: "2", label: "10 m", boxes: "E", note: "Vändningar 180° / 90°." },
  { n: "3", label: "10 m", boxes: "A · B", note: "Framryckning mellan boxar." },
  {
    n: "4",
    label: "20 → 15 → 10 m",
    boxes: "C · D · E",
    note: "Stående, knästående, liggande.",
  },
  {
    n: "5",
    label: "Gevär/Karbin 20 → 15 m · Pistol 10 → 15 m",
    boxes: "F/G · D (gevär) · E · D (pistol)",
    note: "Valbar som pistol eller gevär/karbin.",
  },
];
</script>

<template>
  <div class="range-setup">
    <h1>Dukningsinstruktion</h1>
    <p class="source">SRA / TTS Skjutprov</p>

    <div class="facts">
      <p><strong>Tavla:</strong> IPSC metric.</p>
      <p>
        Dukas på en <strong>höjd av 1,5 m</strong> och ett
        <strong>avstånd av 1,1 m</strong> mellan tavlorna.
      </p>
      <p>Skjutbox ska vara <strong>1 × 1 m</strong>.</p>
      <p>
        Mät från <strong>centrum mellan tavlorna</strong> och märk upp vid
        <strong>20, 15 och 10 m</strong> skjutavstånd. Märk upp boxar enligt
        skiss.
      </p>
      <p>
        Vid <strong>övning 4</strong> gäller inte bakre begränsningslinje vid 10
        m vid liggande skjutställning.
      </p>
    </div>

    <div class="diagram" aria-hidden="true">
      <div class="targets">
        <div class="target-col">
          <img class="target" src="../assets/ipsc-metric-target.png" alt="" />
        </div>
        <div class="spacer"><span class="dim">1,1 m</span></div>
        <div class="target-col">
          <img class="target" src="../assets/ipsc-metric-target.png" alt="" />
        </div>
      </div>

      <div class="row">
        <span class="dist">10 m</span>
        <div class="boxes">
          <div class="box">A</div>
          <div class="gap">1 m</div>
          <div class="box main">E</div>
          <div class="gap">1 m</div>
          <div class="box">B</div>
        </div>
        <span class="uses">Övn 1, 2, 4, 5&nbsp;P (E) · Övn 3 (A/B)</span>
      </div>

      <div class="row">
        <span class="dist">15 m</span>
        <div class="boxes">
          <div class="box main">D</div>
        </div>
        <span class="uses">Övn 4 · Övn 5 (P/G/K)</span>
      </div>

      <div class="row">
        <span class="dist">20 m</span>
        <div class="boxes">
          <div class="box">F</div>
          <div class="box main">C</div>
          <div class="box">G</div>
        </div>
        <span class="uses">Övn 4 (C) · Övn 5 G/K (F/G)</span>
      </div>
    </div>

    <h2>Övningar</h2>
    <table class="exercises">
      <thead>
        <tr>
          <th>Övn</th>
          <th>Avstånd</th>
          <th>Boxar</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ex in exercises" :key="ex.n">
          <td class="n">{{ ex.n }}</td>
          <td>{{ ex.label }}</td>
          <td class="boxes-cell">{{ ex.boxes }}</td>
          <td class="note">{{ ex.note }}</td>
        </tr>
      </tbody>
    </table>

    <p class="footnote">
      Observera att pekvinklar är 90° från skytten, alternativt rakt upp eller
      rakt ner om inte annat anges av aktuell skjutbaneinstruktion.
    </p>
  </div>
</template>

<style scoped>
.range-setup {
  max-width: 760px;
  margin: 0 auto;
  padding: 1rem 1.25rem 3rem;
}
.range-setup h1 {
  font-weight: 700;
  margin-bottom: 0.2rem;
}
.range-setup h2 {
  font-weight: 700;
  margin: 2rem 0 0.5rem;
}
.range-setup strong {
  font-weight: 700;
}
.source {
  color: #666;
  margin-bottom: 1.25rem;
}
.facts p {
  margin-bottom: 0.6rem;
}

/* Schematic */
.diagram {
  position: relative;
  margin: 2rem auto;
  padding: 1.5rem 0.5rem 1rem;
  max-width: 480px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fafafa;
}
.targets {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 0;
}
.target-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.target {
  width: 52px;
  height: auto;
  display: block;
}
.spacer {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  align-self: center;
}
.dim {
  font-size: 0.7rem;
  color: #777;
  white-space: nowrap;
}
.row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.dist {
  text-align: right;
  font-size: 0.8rem;
  font-weight: 700;
  color: #444;
  min-width: 0;
}
.boxes {
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #555;
  background: #fff;
  font-weight: 700;
  font-size: 0.95rem;
}
.box.main {
  border-color: #1a1a1a;
  border-width: 2px;
}
.gap {
  font-size: 0.65rem;
  color: #888;
  padding: 0 0.4rem;
  white-space: nowrap;
}
.uses {
  font-size: 0.72rem;
  color: #666;
  line-height: 1.3;
  min-width: 0;
}

/* Exercises table */
.exercises {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.exercises th,
.exercises td {
  text-align: left;
  padding: 0.45rem 0.6rem;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}
.exercises th {
  font-weight: 700;
  border-bottom: 2px solid #ddd;
}
.exercises .n {
  font-weight: 700;
  width: 2.5rem;
}
.exercises .boxes-cell {
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.exercises .note {
  color: #666;
}

.footnote {
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #555;
  font-style: italic;
}

@media (max-width: 520px) {
  .range-setup {
    padding: 1rem 0.75rem 3rem;
  }
  .uses {
    font-size: 0.68rem;
  }
  .exercises {
    font-size: 0.8rem;
  }
  .exercises th,
  .exercises td {
    padding: 0.4rem 0.35rem;
  }
}
</style>
