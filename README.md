# 🚗 Vehicle Damage Segmentation

An AI-powered mobile application designed to detect, analyze, and segment vehicle damages from images. This project consists of a deep learning-based backend for image processing and a cross-platform mobile frontend.

## 📁 Project Structure

The repository is divided into two main directories:

* **`backend/`**: Contains the artificial intelligence model (`best.pt`) and the backend service (API) that processes incoming vehicle images and returns damage segmentation results.
* **`project/`**: Contains the mobile application source code built with React Native and Expo, allowing users to capture or upload images of vehicles for damage assessment.

## 🛠️ Technologies Used

* **AI & Backend:** Python, Deep Learning/Computer Vision, Git LFS (Large File Storage)
* **Mobile Frontend:** React Native, Expo, JavaScript/TypeScript

## 📊 Dataset & Acknowledgements

The deep learning model in this project was trained using the **CarDD (Car Damage Detection)** dataset. CarDD is a large-scale, high-resolution dataset specifically designed for vision-based car damage detection and segmentation. 

I would like to acknowledge the original authors of the dataset for their valuable contribution to the research community. If you use this dataset, please consider citing their original work:

* **Source:** [CarDD Project Page](https://cardd-ustc.github.io/)

**Citation:**
```bibtex
@article{CarDD,
  author={Wang, Xinkuang and Li, Wenjing and Wu, Zhongcheng},
  journal={IEEE Transactions on Intelligent Transportation Systems},
  title={CarDD: A New Dataset for Vision-Based Car Damage Detection},
  year={2023},
  volume={24},
  number={7},
  pages={7202-7214},
  doi={10.1109/TITS.2023.3258480}
}
## 🚀 Getting Started

To run this project locally, you will need to set up both the backend and the frontend environments.

### Prerequisites
* [Node.js](https://nodejs.org/) and npm
* [Expo CLI](https://docs.expo.dev/get-started/installation/)
* [Python 3.x](https://www.python.org/)
* [Git LFS](https://git-lfs.github.com/) (crucial for downloading the `best.pt` AI model)

### 1. Clone the Repository
Since the AI model is tracked with Git LFS, make sure you have Git LFS installed before cloning:
```bash
git lfs install
git clone [https://github.com/furkankayakilic/VehicleDamageSegmentation.git](https://github.com/furkankayakilic/VehicleDamageSegmentation.git)
cd VehicleDamageSegmentation

