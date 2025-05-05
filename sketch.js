// Hand Pose Drawing with Variable Stroke Width  
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;
let sw = 8;

function preload() {
  // 初始化 HandPose 模型
  handPose = ml5.handPose(video, modelReady);
}

function modelReady() {
  console.log("HandPose model loaded!");
  handPose.on("predict", gotHands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  
  // 創建畫布
  painting = createGraphics(640, 480);
  painting.clear();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

function draw() {
  image(video, 0, 0);

  if (hands.length > 0) {
    let rightHand, leftHand;

    for (let hand of hands) {
      if (hand.handedness == 'Right') {
        let index = hand.annotations.indexFinger[3];
        let thumb = hand.annotations.thumb[3];
        rightHand = { index, thumb };
      }
      if (hand.handedness == 'Left') {
        let index = hand.annotations.indexFinger[3];
        let thumb = hand.annotations.thumb[3];
        leftHand = { index, thumb };
      }
    }

    if (leftHand) {
      let { index, thumb } = leftHand;
      let x = (index[0] + thumb[0]) * 0.5;
      let y = (index[1] + thumb[1]) * 0.5;
      sw = dist(index[0], index[1], thumb[0], thumb[1]);

      fill(255, 0, 255);
      noStroke();
      circle(x, y, sw);
    }

    if (rightHand) {
      let { index, thumb } = rightHand;
      let x = (index[0] + thumb[0]) * 0.5;
      let y = (index[1] + thumb[1]) * 0.5;
      
      let d = dist(index[0], index[1], thumb[0], thumb[1]);
      if (d < 20) {
        painting.stroke(255, 255, 0);
        painting.strokeWeight(sw * 0.5);
        painting.line(px, py, x, y);
      }

      px = x;
      py = y;
    }
  }

  image(painting, 0, 0);
}
