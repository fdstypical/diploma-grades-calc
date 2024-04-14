const buildTable = (rows) => `
  <table>
    <tbody>
      ${rows}
    </tbody>
  </table>
`;

export const fetchTable = (id) =>
  fetch(`https://lk.pnzgu.ru/ajax/grades/${id}/exec/204720/is_show/1`)
    .then((res) => res.json())
    .then((res) => buildTable(res.rows));
