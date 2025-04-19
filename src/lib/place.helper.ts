import cityState from "../mock/cities.json";

export function getCity(state: string) {
  const filteredCities = cityState
    .filter((item) => item.state === state)
    .map((item) => ({
      label: item.name as string,
      value: item.name as string,
    }));

  return filteredCities;
}

export function getState() {
  const statesData: { label: string; value: string }[] = [];

  const state = new Set(cityState.map((item) => item.state)).entries();
  for (const [label, value] of state) {
    statesData.push({ label: label as string, value: value as string });
  }

  return statesData;
}
