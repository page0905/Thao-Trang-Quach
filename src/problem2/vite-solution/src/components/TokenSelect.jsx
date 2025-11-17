import { useState } from "react";

export default function TokenSelect({ label, token, onChange, tokens }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const iconURL = (sym) =>
    `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${sym}.svg`;

  const filteredTokens = tokens.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="input-group">
      <label>{label}</label>

      <div className="custom-select" onClick={() => setOpen((prev) => !prev)}>
        <div className="selected-option">
          <img src={iconURL(token)} alt="" />
          <span>{token}</span>
        </div>

        <span className="arrow">▼</span>

        {open && (
          <div className="options" onClick={(e) => e.stopPropagation()}>
            <input
              className="search-box"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="scroll-area">
              {filteredTokens.map((t) => (
                <div
                  key={t}
                  className={`option ${t === token ? "active" : ""}`}
                  onClick={() => {
                    onChange(t);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <img src={iconURL(t)} alt={t} />
                  <span>{t}</span>
                </div>
              ))}

              {filteredTokens.length === 0 && (
                <div className="no-token">No tokens found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
