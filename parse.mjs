const UNKNOWN_SUBJECT_LABEL = `Unknown |`;

export const GRADE_MAP = {
  ["(E)"]: 3,
  ["(B)"]: 4,
  ["(A)"]: 5,
  ["(Passed)"]: null,
};

export const TYPE_MAP = {
  ["Зачет"]: 0,
  ["Экзамен"]: 1,
  ["Зачет с оценкой"]: 2,
  ["Курсовой проект"]: 3,
  ["Курсовая работа"]: 4,
  ["ИА"]: 5,
};

export const TYPE_ENUM = {
  ...TYPE_MAP,
  0: "Зачет",
  1: "Экзамен",
  2: "Зачет с оценкой",
  3: "Курсовой проект",
  4: "Курсовая работа",
  5: "ИА",
};

export const parseType = (type) =>
  Object.entries(TYPE_MAP).find(
    ([key]) => type?.toLowerCase() == key.toLowerCase()
  )?.[1] ?? null;

export const parseGrade = (grade) =>
  Object.entries(GRADE_MAP).find(([key]) =>
    grade?.toLowerCase()?.includes(key.toLowerCase())
  )?.[1] ?? null;

export const parseRows = (rows) => {
  const list = [];

  for (const row of rows) {
    const cells = [...row.querySelectorAll("td")];

    const type = parseType(cells[3].textContent.trim() || null);
    const grade = parseGrade(cells[6].textContent.trim() || null);
    const name =
      cells[2].textContent.trim() ||
      `${UNKNOWN_SUBJECT_LABEL} ${TYPE_ENUM[type]}`;

    list.push({ name, type, grade });
  }

  return list;
};

export const groupBy = (array, category) =>
  array.reduce((acc, cur) => {
    const cat = cur[category];
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(cur);
    return acc;
  }, {});

export const flat = (grades) => {
  const groups = groupBy(grades, "name");

  const flatted = [];

  for (const [key, values] of Object.entries(groups)) {
    const types = groupBy(values, "type");

    if (key.includes(UNKNOWN_SUBJECT_LABEL)) {
      for (const x of values) flatted.push({ ...x, name: key });
      continue;
    }

    for (const list of Object.values(types)) {
      const last = list.at(-1);
      flatted.push({ ...last, name: key });
    }
  }

  return flatted;
};

export const analyze = (list) => {
  const grades = {};

  for (const { grade } of list) {
    grades[grade] = (grades[grade] ?? 0) + 1;
  }

  const total = list.length;
  const percentage = (grades["4"] * 100) / total;

  return { total, percentage, grades };
};

export default function parse(rows) {
  const grades = parseRows(rows);
  const withNumericGrades = grades.filter((x) => Number.isInteger(x.grade));
  const flattedGrades = flat(withNumericGrades);
  return analyze(flattedGrades);
}
