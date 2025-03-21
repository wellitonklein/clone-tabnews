exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // For references, Github limits usernames to 39 caracterers
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    // For references, RFC 5321 limits email addresses to 254 characters
    // https://stackoverflow.com/a/574698
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // For references, bcrypt limits passwords to 60 characters by hashing
    // https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    // Why timestamp with time zone: https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('UTC', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('UTC', now())"),
    },
  });
};

exports.down = false;
