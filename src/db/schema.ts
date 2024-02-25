import { relations } from "drizzle-orm";
import {
  date,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * User
 */
export const users = mysqlTable("user", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 36 }).primaryKey().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  media: many(media),
}));

/**
 * Publisher
 */
export const publishers = mysqlTable("publishers", {
  id: serial("id").primaryKey(),
  slug: varchar("name", { length: 255 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const publishersRelations = relations(publishers, ({ many }) => ({
  books: many(books),
}));

/**
 * Media
 */
export const media = mysqlTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  type: mysqlEnum("type", ["image", "html"]).notNull(),
  uploadedBy: int("uploaded_by").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaRelations = relations(media, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
}));

/**
 * Books
 */
export const books = mysqlTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  publisherID: int("publisher_id").notNull(),
  summary: text("summary").notNull(),
  year: int("year").notNull(),
  isbn: varchar("isbn", { length: 13 }).notNull(),
  coverImageURL: int("cover_image_url").notNull(),
  language: varchar("language", { length: 255 }).notNull(),
  price: int("price").notNull(),
  status: mysqlEnum("status", ["published", "draft"]).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const booksRelations = relations(books, ({ one, many }) => ({
  publisher: one(publishers, {
    fields: [books.publisherID],
    references: [publishers.id],
  }),
  coverImage: one(media, {
    fields: [books.coverImageURL],
    references: [media.id],
  }),
  authors: many(authors),
  chapters: many(chapters),
  reviews: many(bookReviews),
  categories: many(categories),
}));

/**
 * Authors
 */
export const authors = mysqlTable("authors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  biography: text("biography").notNull(),
  profilePicture: int("profile_picture_url").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authorsRelations = relations(authors, ({ one, many }) => ({
  books: many(books),
  profilePicture: one(media, {
    fields: [authors.profilePicture],
    references: [media.id],
  }),
}));

/**
 * BooksAuthors
 */
export const booksAuthors = mysqlTable(
  "books_authors",
  {
    authorID: int("author_id").notNull(),
    bookID: int("book_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.authorID, t.bookID] }),
  })
);

export const booksAuthorsRelations = relations(booksAuthors, ({ one }) => ({
  book: one(books, {
    fields: [booksAuthors.bookID],
    references: [books.id],
  }),
  author: one(authors, {
    fields: [booksAuthors.authorID],
    references: [authors.id],
  }),
}));

/**
 * Chapters
 */
export const chapters = mysqlTable("chapters", {
  id: serial("id").primaryKey(),
  bookID: int("book_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: int("content").notNull(),
  order: int("order").notNull(),
  parentChapterID: int("parent_chapter_id"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chaptersRelations = relations(chapters, ({ one }) => ({
  book: one(books, {
    fields: [chapters.bookID],
    references: [books.id],
  }),
  parentChapter: one(chapters, {
    fields: [chapters.parentChapterID],
    references: [chapters.id],
  }),
  contentHTML: one(media, {
    fields: [chapters.content],
    references: [media.id],
  }),
}));

/**
 * Categories
 */
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookCategories = mysqlTable(
  "book_categories",
  {
    bookID: int("book_id").notNull(),
    categoryID: int("category_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.bookID, t.categoryID] }),
  })
);

/**
 * BookReviews
 */
export const bookReviews = mysqlTable("book_reviews", {
  id: serial("id").primaryKey(),
  bookID: int("book_id").notNull(),
  userID: int("user_id").notNull(),
  rating: int("rating").notNull(),
  comment: text("comment").notNull(),
  reviewDate: timestamp("review_date").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookReviewsRelations = relations(bookReviews, ({ one }) => ({
  book: one(books, {
    fields: [bookReviews.bookID],
    references: [books.id],
  }),
  user: one(users, {
    fields: [bookReviews.userID],
    references: [users.id],
  }),
}));

/**
 * Payments
 */
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  bookID: int("book_id").notNull(),
  userID: int("user_id").notNull(),
  stripePaymentIntentID: varchar("stripe_payment_intent_id", {
    length: 255,
  }).notNull(),
  amount: int("amount").notNull(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed"]).notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  book: one(books, {
    fields: [payments.bookID],
    references: [books.id],
  }),
  user: one(users, {
    fields: [payments.userID],
    references: [users.id],
  }),
}));

/**
 * ReadingProgress
 */
export const readingProgress = mysqlTable("reading_progress", {
  id: serial("id").primaryKey(),
  bookID: int("book_id").notNull(),
  userID: int("user_id").notNull(),
  lastChapterReadID: int("last_chapter_read_id").notNull(),
  lastPosition: int("last_position").notNull(),
  percentageComplete: int("percentage_complete").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const readingProgressRelations = relations(
  readingProgress,
  ({ one }) => ({
    book: one(books, {
      fields: [readingProgress.bookID],
      references: [books.id],
    }),
    user: one(users, {
      fields: [readingProgress.userID],
      references: [users.id],
    }),
    lastChapterRead: one(chapters, {
      fields: [readingProgress.lastChapterReadID],
      references: [chapters.id],
    }),
  })
);

/**
 * Bookmarks
 */
export const bookmarks = mysqlTable("bookmarks", {
  id: serial("id").primaryKey(),
  bookID: int("book_id").notNull(),
  userID: int("user_id").notNull(),
  chapterID: int("chapter_id").notNull(),
  startPosition: int("start_position").notNull(),
  endPosition: int("end_position").notNull(),
  selectedText: text("selected_text").notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  note: text("note"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  book: one(books, {
    fields: [bookmarks.bookID],
    references: [books.id],
  }),
  user: one(users, {
    fields: [bookmarks.userID],
    references: [users.id],
  }),
  chapter: one(chapters, {
    fields: [bookmarks.chapterID],
    references: [chapters.id],
  }),
}));

/**
 * Books Collections
 */
export const collections = mysqlTable("collections", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  books: many(books),
}));

export const booksCollections = mysqlTable(
  "books_collections",
  {
    collectionID: int("collection_id").notNull(),
    bookID: int("book_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.collectionID, t.bookID] }),
  })
);

export const booksCollectionsRelations = relations(
  booksCollections,
  ({ one }) => ({
    collection: one(collections, {
      fields: [booksCollections.collectionID],
      references: [collections.id],
    }),
    book: one(books, {
      fields: [booksCollections.bookID],
      references: [books.id],
    }),
  })
);

/**
 * User Activity
 */
export const userActivity = mysqlTable("user_activity", {
  id: serial("id").primaryKey(),
  userID: int("user_id").notNull(),
  bookID: int("book_id").notNull(),
  chapterID: int("chapter_id").notNull(),
  date: date("date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  totalDuration: int("total_duration").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userActivityRelations = relations(userActivity, ({ one }) => ({
  user: one(users, {
    fields: [userActivity.userID],
    references: [users.id],
  }),
  book: one(books, {
    fields: [userActivity.bookID],
    references: [books.id],
  }),
  chapter: one(chapters, {
    fields: [userActivity.chapterID],
    references: [chapters.id],
  }),
}));
