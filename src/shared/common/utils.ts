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
