# 1. 기본 환경 설정
구글에 '리액트 네이티브 환경 설정' 검색 후 따라하면 됩니다

이때 jdk는 jdk-17을 권장

# 2. npm 모듈 설치
### a. 필요한 라이브러리 설치
/front-app 경로에서 ```npm i``` 명령어 실행
### b. react-native-share-menu 수정
[관련 github issue](https://github.com/Expensify/react-native-share-menu/issues/261)  

요약하면 node_modeuls/react-native-share-menu/android/build.gradle 파일의 내용을 아래로 수정

```
apply plugin: 'com.android.library'

android {
    // compileSdkVersion 29
    // buildToolsVersion "29.0.2"

    defaultConfig {
        compileSdkVersion 36
        minSdkVersion 16
        targetSdkVersion 36
        versionCode 1
        versionName "1.0"
        ndk {
            abiFilters "armeabi-v7a", "x86"
        }
    }
    lintOptions {
       warning 'InvalidPackage'
    }
}

dependencies {
    //noinspection GradleDynamicVersion
    implementation 'com.facebook.react:react-native:+'
}
```