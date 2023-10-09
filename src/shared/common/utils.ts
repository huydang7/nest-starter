import bcrypt from 'bcrypt';

export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function validateHash(password?: string, hash?: string) {
  if (!password || !hash) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(password, hash);
}

export const enumToArray = (enumObject) => {
  return Object.keys(enumObject).map((key) => enumObject[key]);
};

export const isUUID = (uuid: string) => {
  const uuidRegex = '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  return uuid.match(uuidRegex);
};
