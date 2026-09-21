현재 웹 포트폴리오 프로젝트 전체를 먼저 읽고 기존 디자인 시스템, HTML/CSS/JavaScript 구조, 프로젝트 카드 구성, 반응형 레이아웃을 파악해 주세요.

이번 작업의 목적은 제 연구 논문을 웹 포트폴리오에 정식 프로젝트/연구 경험으로 추가하는 것입니다.

단순히 논문 제목과 링크만 추가하지 말고, 채용 담당자가 약 1~2분 안에 다음 내용을 이해할 수 있도록 구성해 주세요.

- 어떤 문제를 다룬 연구인지
- 어떤 데이터를 사용했는지
- 어떤 모델을 사용했는지
- 기존 모델에서 무엇을 개선했는지
- 실제 성능이 얼마나 개선되었는지
- 제가 어떤 연구 경험을 했는지

중요:
- 기존 포트폴리오의 디자인과 톤을 최대한 유지하세요.
- 기존 페이지 구조를 전면 개편하지 마세요.
- 현재 프로젝트의 HTML/CSS/JS 구성 방식을 우선적으로 따르세요.
- 새로운 프레임워크를 추가하지 마세요.
- 현재 반응형 UI, 다크/라이트 모드 등이 있다면 그대로 호환되도록 구현하세요.
- 아래 제공한 사실을 기반으로 작성하고, 확인되지 않은 내용을 임의로 만들어내지 마세요.
- 논문 게재 링크, DOI, IEEE Xplore 링크 등이 프로젝트 안에 없다면 임의 링크를 생성하지 마세요.
- 아직 확인되지 않은 publication status는 임의로 "Published"라고 표현하지 마세요.
- 필요한 경우 `To be updated`, `IEEE INDIN 2026`, `Conference Paper` 등의 안전한 표현을 사용하세요.

---

# 논문 정보

## Title

Vehicle Type Specific Traffic Volume Analysis Using STGCN with LSTM-Based Residual Correction

## Conference

IEEE International Conference on Industrial Informatics (INDIN 2026)

## Research Area

- Traffic Prediction
- Spatio-Temporal Graph Neural Network
- LSTM
- Intelligent Transportation Systems
- AI for Industrial Applications

## Author Information

저는 이 논문의 제1저자입니다.

Name:
Seongon Moon / 문선곤

논문에서 실제 저자 순서나 표기가 프로젝트 파일 또는 논문 PDF에서 확인 가능하다면 해당 정보를 그대로 사용하세요.

---

# 연구 목적

실제 도로 교통 데이터에서 차량 종류별 교통 상태를 예측하는 문제를 다룹니다.

기본 모델인 STGCN(Spatio-Temporal Graph Convolutional Network)이 공간적·시간적 패턴을 학습한 후에도 남는 예측 오차(residual)를 LSTM을 통해 추가적으로 학습하여 예측 성능을 개선하는 것이 핵심 아이디어입니다.

제안 모델은 다음과 같은 구조입니다.

STGCN
→ prediction
→ residual error modeling
→ LSTM-based residual correction
→ final prediction

즉 STGCN 자체를 완전히 대체하는 모델이 아니라,

"STGCN이 놓친 시간적 오차 패턴을 LSTM으로 추가 보정하는 구조"

라는 점이 핵심입니다.

---

# Dataset

실제 경기도 부천시 도로망에서 수집된 교통 데이터를 사용했습니다.

데이터 특성:

- Location: Bucheon City, Gyeonggi-do, South Korea
- 9 intersections
- 1,370 lanes
- 30 days of traffic data
- Data collected between August and October 2022
- 5-minute intervals
- 288 time intervals per day

도로망은 graph 형태로 구성했습니다.

- Each lane = graph node
- Total nodes = 1,370
- Lane-to-lane physical connectivity = adjacency matrix
- Self-loops included

---

# Vehicle Types

4가지 차종을 개별적으로 다룹니다.

- Passenger Car
- Bus
- Truck
- Motorcycle

각 차종에 대해 다음 두 가지 교통 정보를 사용합니다.

- Queue Length
- Average Speed

---

# Model Input / Output

모델은 과거 12개 time step을 입력으로 사용합니다.

5분 간격 데이터이므로:

12 time steps = 1 hour

즉,

Past 1 hour traffic information
→ predict next 5-minute traffic condition

Input:

- 9 channels
- Queue length + average speed for 4 vehicle types = 8 channels
- Time-of-day encoding = 1 channel
- Total = 9 input channels

Output:

- Queue length + average speed for 4 vehicle types
- Total = 8 output channels

---

# Model Comparison

Baseline:

STGCN

Proposed:

STGCN + LSTM-based Residual Correction

Model size:

- STGCN: approximately 1.5M parameters
- Proposed model: approximately 1.8M parameters

---

# Main Results

전체 결과 기준:

MAE

- STGCN: 0.2848
- Proposed: 0.1549
- Improvement: 45.6%

RMSE

- STGCN: 0.8573
- Proposed: 0.4316
- Improvement: 49.7%

이 수치는 포트폴리오에서 시각적으로 강조해 주세요.

예:

45.6% lower MAE
49.7% lower RMSE

단, "accuracy improved by 49.7%"처럼 metric의 의미가 달라지는 표현으로 바꾸지 마세요.

정확히 MAE와 RMSE 감소율이라는 점을 유지하세요.

---

# 결과 해석

핵심 메시지는 다음과 같습니다.

1. STGCN은 도로 네트워크의 spatial-temporal pattern을 학습합니다.

2. 하지만 일부 차량 유형이나 시간 구간에서는 예측 residual이 남습니다.

3. LSTM residual correction module이 이러한 시간적 residual pattern을 추가로 학습합니다.

4. 결과적으로 STGCN 단독 모델보다 전체 MAE와 RMSE가 감소했습니다.

Bus와 Motorcycle의 경우 Passenger Car 및 Truck에 비해 데이터의 traffic volume이 상대적으로 적으며, 실험에서 상대적으로 큰 개선이 관찰되었습니다.

다만 다음과 같은 강한 인과 표현은 피하세요.

"Low volume caused the improvement."

대신 다음처럼 작성하세요.

"Bus and motorcycle traffic had relatively lower volumes, and larger relative improvements were observed for these vehicle types."

또는 비슷한 수준의 신중한 표현을 사용하세요.

---

# 포트폴리오 UI 구성

현재 프로젝트의 기존 디자인을 먼저 분석한 뒤 가장 자연스러운 위치에 추가하세요.

가능하면 두 단계 구조로 구성해 주세요.

## 1. 메인 Projects 또는 Research 카드

기존 프로젝트 카드와 동일한 스타일로 논문 카드를 추가합니다.

카드에 너무 많은 내용을 넣지 마세요.

권장 내용:

Category:
Research / Conference Paper

Title:
Vehicle Type Specific Traffic Volume Analysis Using STGCN with LSTM-Based Residual Correction

Conference:
IEEE INDIN 2026

Short Description 예시:

"Developed an STGCN-based traffic prediction model with LSTM residual correction using real-world traffic data from 1,370 lanes in Bucheon."

핵심 성능:

- MAE ↓ 45.6%
- RMSE ↓ 49.7%

기술 태그 예시:

- Python
- PyTorch
- STGCN
- LSTM
- Graph Neural Network
- Traffic Prediction

실제 프로젝트에서 사용한 기술이 확인되는 경우에만 기술 태그를 확정하세요.

---

## 2. 논문 상세 영역

카드를 클릭하거나 별도의 섹션/페이지에서 상세 내용을 볼 수 있도록 해 주세요.

현재 포트폴리오 구조상 별도 페이지가 어색하다면 같은 페이지 안에서 상세 섹션으로 만들어도 됩니다.

다음 순서를 추천합니다.

### Overview

연구 문제를 2~3문장으로 설명합니다.

### Dataset

간단한 숫자 중심의 정보 카드 형태를 사용할 수 있습니다.

예:

9
Intersections

1,370
Lane Nodes

30 Days
Traffic Data

5 min
Sampling Interval

### Model

STGCN과 Proposed Model의 관계를 간단하게 설명합니다.

가능하다면 CSS로 단순한 flow diagram을 만들어도 됩니다.

예:

Traffic Data
↓
STGCN
↓
Base Prediction
↓
LSTM Residual Correction
↓
Final Prediction

과도하게 복잡한 모델 구조 그림은 새로 만들어내지 마세요.

### Results

MAE와 RMSE를 가장 강조합니다.

예:

STGCN
MAE 0.2848

Proposed
MAE 0.1549

45.6% Reduction

그리고

STGCN
RMSE 0.8573

Proposed
RMSE 0.4316

49.7% Reduction

숫자가 한눈에 보이도록 구성하세요.

### Key Contribution

다음과 같은 핵심 contribution을 짧게 정리해 주세요.

- Vehicle-type-specific traffic prediction
- Real-world lane-level road network modeling
- STGCN-based spatial-temporal prediction
- LSTM residual correction
- Significant reduction in MAE and RMSE

과장된 표현은 피하세요.

---

# 이미지 및 논문 파일

현재 프로젝트 폴더 또는 제공된 자료 안에 다음 자료가 있는지 먼저 찾아보세요.

- 논문 PDF
- 모델 구조 이미지
- prediction result graphs
- STGCN vs proposed result figures
- conference presentation figures
- dataset / graph structure images

사용 가능한 이미지가 있다면 기존 결과를 우선 활용하세요.

이미지를 임의로 재생성하거나 실험 결과를 만들어내지 마세요.

논문 PDF를 웹사이트에서 직접 제공할 수 있다면 다음과 같은 버튼을 추가해 주세요.

- View Paper
- View Conference Paper
- PDF

하지만 실제 PDF 파일이 프로젝트 안에 있을 때만 연결하세요.

IEEE Xplore URL 또는 DOI가 확인되지 않았다면 임의로 링크하지 마세요.

---

# 채용 포트폴리오 관점에서 강조할 부분

이 페이지는 연구자 전용 홈페이지가 아니라 소프트웨어/엔지니어 직무 지원용 포트폴리오입니다.

따라서 논문의 수식이나 이론을 길게 설명하기보다는 다음 내용을 강조하세요.

- Real-world dataset handling
- Graph-structured data
- Deep learning model implementation
- Model comparison and evaluation
- Experimental analysis
- Performance improvement
- Research experience

채용 담당자가 머신러닝 전문가가 아니더라도 이해할 수 있도록 작성하세요.

---

# 문체

웹사이트의 기존 언어가 영어라면 영어로 작성하세요.

영어는 논문 문체처럼 지나치게 딱딱하게 작성하지 말고, 포트폴리오에 적합한 간결한 영어를 사용하세요.

예:

Bad:
"The proposed architecture demonstrates superior efficacy with respect to..."

Good:
"Added an LSTM-based residual correction module to STGCN to capture prediction errors that remained after the baseline model."

전문 용어가 필요한 부분에서는 정확한 용어를 유지하세요.

---

# 반응형 UI

Desktop뿐만 아니라 mobile에서도 확인하세요.

특히:

- 긴 논문 제목 줄바꿈
- metric cards
- model flow
- image scaling
- 기술 태그
- 버튼 영역

이 깨지지 않도록 수정하세요.

---

# 작업 방식

1. 기존 프로젝트 구조 분석
2. 수정이 필요한 파일 확인
3. 구현 방향 간략히 설명
4. 코드 수정
5. 기존 기능 손상 여부 확인
6. 반응형 확인
7. 최종 변경사항 요약

기존 코드 스타일을 최대한 유지하세요.

불필요한 리팩터링은 하지 마세요.

완료 후 다음 내용을 알려 주세요.

- 수정한 파일
- 추가한 논문 섹션 구조
- 사용한 논문 이미지/파일
- 추가한 링크
- 반응형 처리 내용
- 확인이 필요한 publication 정보
- 사용자가 추가로 제공해야 할 자료