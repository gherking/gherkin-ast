import { GherkinDocument } from "../gherkinObject";
import { GherkinCommentHandler } from "../common";
import { Comment } from "./comment";
import { Feature } from "./feature";
import { UniqueObject } from "./uniqueObject";
import { dirname, basename } from "path";
import { getDebugger } from "../debug";
const debug = getDebugger("Document");

/**
 * Model for Document
 */
export class Document extends UniqueObject {
  public static parse(obj: GherkinDocument): Document {
    debug("parse(obj: %o)", obj);
    if (!obj || !obj.gherkinDocument) {
      throw new TypeError("The given object is not a GherkinDocument!");
    }
    const comments: GherkinCommentHandler = new GherkinCommentHandler(obj.gherkinDocument?.comments);
    const document: Document = new Document(obj.gherkinDocument.uri);

    document.feature = Feature.parse(obj.gherkinDocument.feature, comments);

    document.startComment = comments.parseStartingComment();
    document.endComment = comments.parseEndingComment();

    debug(
      "parse(this: {uri: '%s', feature: '%s', startComment: '%s', endComment: '%s'})",
      document.uri, document.feature?.name, document.startComment?.text,
      document.endComment?.text,
    )
    return document;
  }

  /** URI of the original file, parsed */
  public uri: string;
  /* Folder path of the source file */
  public sourceFolder: string;
  /* Filename of the source file */
  public sourceFile: string;
  /* Folder path of the target file will be produced in gherking */
  public targetFolder: string;
  /* Filename of the target file will be produced in gherking */
  public targetFile: string;

  /** Comment at the start of the feature file */
  public startComment: Comment;
  /** Comment at the end of the feature file */
  public endComment: Comment;

  constructor(uri: string, public feature: Feature = null) {
    super();

    this.startComment = null;
    this.endComment = null;

    this.uri = uri;
    this.sourceFile = basename(uri);
    this.sourceFolder = dirname(uri);
    this.targetFile = this.sourceFile;
    this.targetFolder = this.sourceFolder;

    debug(
      "constructor(this: {uri: '%s', sourceFile: '%s', sourceFolder: '%s', " +
      "targetFile: '%s', targetFolder: '%s', " +
      "feature: '%s', startComment: '%s', endComment: '%s'})",
      this.uri, this.sourceFile, this.sourceFolder, this.targetFile,
      this.targetFolder, this.feature?.name, this.startComment?.text,
      this.endComment?.text,
    );
  }

  public clone(): Document {
    debug(
      "clone(this: {uri: '%s', sourceFile: '%s', sourceFolder: '%s', " +
      "targetFile: '%s', targetFolder: '%s', " +
      "feature: '%s', startComment: '%s', endComment: '%s'})",
      this.uri, this.sourceFile, this.sourceFolder, this.targetFile,
      this.targetFolder, this.feature?.name, this.startComment?.text,
      this.endComment?.text,
    );
    const document: Document = new Document(this.uri);

    document.feature = this.feature ? this.feature.clone() : null;
    document.startComment = this.startComment ? this.startComment.clone() : null;
    document.endComment = this.endComment ? this.endComment.clone() : null;

    return document;
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    this.feature && this.feature.replace(key, value);
    this.startComment && this.startComment.replace(key, value);
    this.endComment && this.endComment.replace(key, value);
  }
}
