export default function AmountInput({ value, onChange }) {
  return (
    <div className="form-group">
      <label>Amount</label>
      <input
        type="number"
        className="styled-number"
        placeholder="Enter amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
