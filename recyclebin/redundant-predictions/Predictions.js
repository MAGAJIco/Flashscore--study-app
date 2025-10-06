class Prediction {
  constructor(id, title, content, authorId, sport, matchDetails, confidence, status = "pending") {
    this.id = id;
    this.title = title;
    this.content = content;
    this.authorId = authorId;
    this.sport = sport;
    this.matchDetails = matchDetails;
    this.confidence = confidence;
    this.status = status;
    this.isActive = true;
    this.result = null;
  }

  publish() {
    this.status = "active";
  }

  complete(result) {
    this.status = "completed";
    this.result = result;
  }

  update(updateData) {
    Object.assign(this, updateData);
  }

  validate() {
    const errors = [];
    if (!this.title) errors.push("Title is required");
    if (!this.content) errors.push("Content is required");
    if (!this.authorId) errors.push("Author ID is required");
    if (!this.sport) errors.push("Sport is required");

    return { isValid: errors.length === 0, errors };
  }

  toAPI() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      authorId: this.authorId,
      sport: this.sport,
      matchDetails: this.matchDetails,
      confidence: this.confidence,
      status: this.status,
      result: this.result,
    };
  }
}

module.exports = Prediction;