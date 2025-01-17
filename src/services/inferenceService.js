const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;
    const classResult = confidenceScore > 50 ? "Cancer" : "Non-cancer";
    const label = classResult;

    let suggestion;
    if (label === "Cancer") {
      suggestion = "Kamu terindikasi kanker, Segera ke dokter semoga lekas sembuh!";
    } else {
      suggestion = "Kamu tidak terindikasi kanker, Alhamdulillah Kamu Sehat!";
    }

    return { label, suggestion };
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi", 400);
  }
}

module.exports = predictClassification;