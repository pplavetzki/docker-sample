exports.map = function(doc) {
  if ('date' in doc) emit(doc.date, null)
}