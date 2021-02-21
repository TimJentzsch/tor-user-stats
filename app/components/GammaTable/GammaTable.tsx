export default function GammaTable(): JSX.Element {
  return (
    <table>
      <caption>Gamma Stats</caption>
      <tr>
        <th></th>
        <th>1 h</th>
        <th>24 h</th>
        <th>7 d</th>
        <th>365 d</th>
      </tr>
      <tr>
        <th className="right-th">Recent</th>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
      </tr>
      <tr>
        <th className="right-th">Peak</th>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
      </tr>
      <tr>
        <th className="right-th">Average</th>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
        <td>0.00</td>
      </tr>
    </table>
  );
}
