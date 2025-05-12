let faceapi;
let video;
let predictions = [];
const pointsToDraw = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];

// 新增的兩個陣列
const array1 = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
const array2 = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

function setup() {
  createCanvas(400, 400);

  // 初始化攝影機
  video = createCapture(VIDEO, function(stream) {
    console.log("攝影機已啟用");
  });
  video.size(width, height);
  video.hide();

  // 初始化 faceApi 模型
  const options = { withLandmarks: true, withDescriptors: false };
  faceapi = ml5.faceApi(video, options, modelReady);
}

function modelReady() {
  console.log("FaceApi 模型已準備好！");
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.error("偵測錯誤：", err);
    return;
  }
  predictions = result;
  faceapi.detect(gotResults); // 持續偵測
}

function draw() {
  // 確保攝影機影像已載入
  if (!video.loadedmetadata) {
    console.log("等待攝影機載入...");
    return;
  }

  image(video, 0, 0, width, height);

  // 繪製指定的點並串接
  drawConnectedPoints(pointsToDraw, color(255, 0, 0), 5); // 紅色線條，粗細為 5
  drawConnectedPoints(array1, color(0, 255, 0), 3); // 綠色線條，粗細為 3
  drawConnectedPoints(array2, color(0, 0, 255), 3); // 藍色線條，粗細為 3
}

function drawConnectedPoints(pointsArray, strokeColor, strokeWidth) {
  for (let i = 0; i < predictions.length; i++) {
    const keypoints = predictions[i].landmarks.positions;

    // 設定線條樣式
    stroke(strokeColor); // 設定線條顏色
    strokeWeight(strokeWidth); // 設定線條粗細
    noFill();

    // 串接所有指定的點
    for (let j = 0; j < pointsArray.length - 1; j++) {
      const indexA = pointsArray[j];
      const indexB = pointsArray[j + 1];
      const { x: x1, y: y1 } = keypoints[indexA];
      const { x: x2, y: y2 } = keypoints[indexB];
      line(x1, y1, x2, y2); // 繪製連接線
    }
  }
}
