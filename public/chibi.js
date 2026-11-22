// Original layered SVG models: three outfits, hairstyles and shaded faces.
const palettes = [
  {
    dress: "#ee79be",
    dark: "#b63e85",
    hair: "#523159",
    shine: "#98698a",
    bow: "#ffcae5",
    name: "Đào",
    style: "tails",
  },
  {
    dress: "#b099f4",
    dark: "#7654b5",
    hair: "#493367",
    shine: "#9672b6",
    bow: "#f1d3ff",
    name: "Mây",
    style: "buns",
  },
  {
    dress: "#8ce0d0",
    dark: "#368e8a",
    hair: "#885447",
    shine: "#ca9474",
    bow: "#fff0af",
    name: "Miu",
    style: "bob",
  },
];
function pom(x, y, color) {
  return `<g class="pom"><circle cx="${x}" cy="${y}" r="23" fill="${color}" opacity=".6"/>${Array.from(
    { length: 24 },
    (_, i) => {
      const a = (i * Math.PI) / 12,
        r = 21 + (i % 4) * 2;
      return `<path d="M${x} ${y}Q${x + Math.cos(a + 0.3) * r * 0.5} ${y + Math.sin(a + 0.3) * r * 0.5} ${x + Math.cos(a) * r} ${y + Math.sin(a) * r}" stroke="${i % 3 ? color : "#fffbe9"}" stroke-width="4" stroke-linecap="round"/>`;
    },
  ).join(
    "",
  )}<circle cx="${x - 5}" cy="${y - 7}" r="7" fill="#fff" opacity=".65"/></g>`;
}
export function cheerleader(variant = 0) {
  const index = Math.abs(Math.trunc(variant)) % 3,
    p = palettes[index],
    id = `girl-${index}`;
  const back =
    p.style === "tails"
      ? `<path d="M53 61Q8 51 22 128L42 167Q66 125 62 82M165 61Q210 49 199 127L179 167Q153 125 158 82"/>`
      : p.style === "buns"
        ? `<circle cx="48" cy="62" r="29"/><circle cx="173" cy="62" r="29"/><path d="M52 78q-18 48 12 77l9-60m93-17q18 48-12 77l-9-60"/>`
        : `<path d="M45 73Q24 154 61 174L83 141l54 1 26 32q33-28 13-103Z"/>`;
  return `<svg class="chibi" viewBox="0 0 220 300" role="img" aria-label="Chibi nữ ${p.name} cầm bông cổ vũ"><defs><radialGradient id="${id}-skin" cx=".42" cy=".35" r=".75"><stop stop-color="#fff0de"/><stop offset=".7" stop-color="#ffdac4"/><stop offset="1" stop-color="#edb5a6"/></radialGradient><linearGradient id="${id}-dress" x2=".8" y2="1"><stop stop-color="${p.bow}"/><stop offset=".45" stop-color="${p.dress}"/><stop offset="1" stop-color="${p.dark}"/></linearGradient><radialGradient id="${id}-eye" cx=".35" cy=".3"><stop stop-color="#a880b8"/><stop offset=".4" stop-color="#634074"/><stop offset="1" stop-color="#2e1b3b"/></radialGradient></defs><ellipse cx="110" cy="284" rx="45" ry="8" fill="#080018" opacity=".25"/><g class="girl"><g fill="${p.hair}" stroke="#38233f" stroke-width="3" stroke-linejoin="round">${back}</g><g class="leg leg-left"><path d="m93 225-7 38" stroke="#ffdac4" stroke-width="15" stroke-linecap="round"/><path d="m79 250 17 2-1 17-19-1" fill="#fff6fb"/><path d="m78 262-8 12q16 8 30 0l-4-12Z" fill="${p.dark}" stroke="#492b52" stroke-width="2"/><path d="m76 272h22" stroke="#f8e7ff" stroke-width="3"/></g><g class="leg leg-right"><path d="m127 225 7 38" stroke="#ffdac4" stroke-width="15" stroke-linecap="round"/><path d="m125 252 17-2 3 18-19 1" fill="#fff6fb"/><path d="m125 262-4 12q15 7 31-1l-9-12Z" fill="${p.dark}" stroke="#492b52" stroke-width="2"/><path d="m124 273h24" stroke="#f8e7ff" stroke-width="3"/></g><path d="M88 160q22-11 44 0l12 45H76Z" fill="url(#${id}-dress)" stroke="${p.dark}" stroke-width="3"/><path d="m89 162 21 16 21-16-8-5h-26Z" fill="#fff7ed"/><path d="M76 201 62 235q48 23 96 0l-15-34Z" fill="url(#${id}-dress)" stroke="${p.dark}" stroke-width="3"/><path d="m81 210-6 24m25-23-2 29m23-29 3 29m14-30 8 23" stroke="${p.bow}" stroke-width="5"/><path d="m74 200h72m-77 34q41 18 82 0" fill="none" stroke="#fff3fb" stroke-width="4"/><path d="m110 184-6-6q-10-3-10 7 0 6 16 16 16-10 16-16 0-10-10-7Z" fill="#fff3b3"/><g class="arm arm-left"><path d="M85 172Q61 175 42 136" fill="none" stroke="${p.dark}" stroke-width="20" stroke-linecap="round"/><path d="M72 169 45 141 36 125" fill="none" stroke="#ffdac4" stroke-width="13" stroke-linecap="round"/><circle cx="34" cy="122" r="9" fill="#ffdac4"/>${pom(29, 109, index === 2 ? "#fff0a2" : p.bow)}</g><g class="arm arm-right"><path d="M136 172q26 2 43-39" fill="none" stroke="${p.dark}" stroke-width="20" stroke-linecap="round"/><path d="m149 168 25-28 10-19" fill="none" stroke="#ffdac4" stroke-width="13" stroke-linecap="round"/><circle cx="186" cy="117" r="9" fill="#ffdac4"/>${pom(191, 104, p.dress)}</g><g class="girl-head"><ellipse cx="110" cy="100" rx="65" ry="64" fill="url(#${id}-skin)" stroke="#ae7781" stroke-width="2.5"/><path d="M45 100Q27 21 108 22q82-2 67 81l-17-20-5-27q-13 26-42 25l9-18q-24 30-60 24l-9 21Z" fill="${p.hair}" stroke="#38233f" stroke-width="3"/><path d="M55 65q14-29 46-29m20 2q29 0 43 27" fill="none" stroke="${p.shine}" stroke-width="7" stroke-linecap="round" opacity=".65"/><path d="m48 54-21-9 5 25 24-8m111-8 20-9-4 25-24-8Z" fill="${p.bow}" stroke="${p.dark}" stroke-width="2"/><circle cx="49" cy="59" r="6" fill="${p.dress}"/><circle cx="169" cy="59" r="6" fill="${p.dress}"/><g class="eyes"><ellipse cx="84" cy="110" rx="10" ry="15" fill="url(#${id}-eye)"/><ellipse cx="136" cy="110" rx="10" ry="15" fill="url(#${id}-eye)"/><ellipse cx="81" cy="105" rx="4" ry="5" fill="white"/><ellipse cx="133" cy="105" rx="4" ry="5" fill="white"/><circle cx="88" cy="117" r="2.5" fill="#ffdaef"/><circle cx="140" cy="117" r="2.5" fill="#ffdaef"/><path d="m74 99-7-3m78 3 7-3" stroke="#513247" stroke-width="3" stroke-linecap="round"/></g><ellipse cx="71" cy="132" rx="13" ry="6.5" fill="#f298b3" opacity=".72"/><ellipse cx="149" cy="132" rx="13" ry="6.5" fill="#f298b3" opacity=".72"/><path d="m69 130-3 4m10-3-2 4m72-5-2 4m10-3-2 4" stroke="#e8769f" stroke-width="1.5"/><path d="M102 134q8 6 16 0-1 15-8 15-7 0-8-15Z" fill="#a64f6d"/><path d="M106 144q4-3 8 0" stroke="#f29aba" stroke-width="3" stroke-linecap="round"/><path d="m107 123 3 2 3-2" fill="none" stroke="#d9a293" stroke-width="2" stroke-linecap="round"/></g></g></svg>`;
}
