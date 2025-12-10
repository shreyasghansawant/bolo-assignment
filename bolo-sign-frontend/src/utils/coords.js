export function normalizeCoords(field) {
  return {
    x: field.x,
    y: field.y,
    w: field.w,
    h: field.h,
    page: field.page || 1
  };
}

