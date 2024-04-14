const buildTable = (rows) => `
  <table>
    <tbody>
      ${rows}
    </tbody>
  </table>
`;

export const fetchTable = (studentId, execId) =>
  fetch(`https://lk.pnzgu.ru/ajax/grades/${studentId}/exec/${execId}/is_show/1`)
    .then((res) => res.json())
    .then((res) => buildTable(res.rows));
