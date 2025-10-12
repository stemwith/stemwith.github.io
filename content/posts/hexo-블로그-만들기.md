---
title: "hexo icarus 테마로 Github 블로그 만들기"
categories: ["diy"]
date: 2019-09-01T18:27:53+09:00
toc: true
tags:
---

### 필수 요소

Hexo를 이용하여 블로그를 만들기에 앞서 아래 요소를 먼저 설치

- git
- github.com에 repository 2개 생성하기
  - 사용자ID-archives
  - 사용자ID.github.io
- node.js
- npm

[hexo.io](https://hexo.io) 사이트에는 이를 위한 설치 방법이 간단하게 요약이 되어 있지만, 이것만으로 자신이 원하는 형태의 블로그를 운영하기는 쉽지 않다. 이 글은 아무것도 설치 되어있지 않은 상태의 윈도우 사용 컴퓨터 사용자를 기준으로, d드라이브에 hexo 블로그를 생성하고 운영하는 방법을 차례대로 따라할 수 있도록 정리한 것이다.

<br>

#### Git 설치

1. https://git-scm.com/download/win 에서 **64-bit Git for Windows Setup** 다운로드
2. 설치 (설치 경로는 바꾸지 않음)
3. exe 파일은 삭제

<br>

#### nodejs 설치

1. https://nodejs.org/en/download/ 에서 Windows Installer (.msi) 64-bit 다운로드

2. 설치 (설치 경로는 바꾸지 않음)

3. (선택사항) 설치 중 Tools for Native Modules 에서 Automatically install the necessary tools에 체크
   
   - chocolately, python, visualstudio 등 여러가지 패키지가 설치됨
   - 설치 후, 리부팅 필요

4. 환경 변수 구성: **제어판> 고급 시스템 설정 보기> 고급> 환경 변수**를 열고, **사용자 변수와 시스템 변수**에 다음을 새로만들기 혹은 추가
   
   - PATH 변수에 아래의 변수값 지정되어 있는지 확인 (없으면 새로 만들기)
     - 변수값: C:\Program Files\nodejs 

<br>

#### git-bash 실행 후, hexo 및 icarus 테마 설치

```[bash]
cd d:/dev
npm install -g hexo-cli 
```

```[bash]
mkdir myblog
hexo init myblog               // myblog 폴더가 비어 있어야 함.
cd myblog
git clone --depth 1 https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
hexo config theme icarus
```

<br>

* 아래와 같은 error 메세지가 나오면,

```[bash]
ERROR Package bulma-stylus is not installed.
ERROR Package hexo-renderer-inferno is not installed.
ERROR Package hexo-component-inferno is not installed.
ERROR Package inferno is not installed.
ERROR Package inferno-create-element is not installed.
ERROR Please install the missing dependencies your Hexo site root directory:
ERROR npm install --save bulma-stylus@0.8.0 hexo-renderer-inferno@^0.1.3 hexo-component-inferno@^0.13.0 inferno@^7.3.3 inferno-create-element@^7.3.3
ERROR or:
ERROR yarn add bulma-stylus@0.8.0 hexo-renderer-inferno@^0.1.3 hexo-component-inferno@^0.13.0 inferno@^7.3.3 inferno-create-element@^7.3.3
```

<br>

* 패키지를 추가 설치한 후

```[bash]
npm install --save bulma-stylus@0.8.0 hexo-renderer-inferno@^0.1.3 hexo-component-inferno@^0.13.0 inferno@^7.3.3 inferno-create-element@^7.3.3
```

<br>

* 다시 실행

```[bash]
hexo config theme icarus
```

<br>

* 이후에 아래와 같은 메세지가 나오면  _config.icarus.yml이 생성되면서 완료된다.

```[bash]
INFO  Validating config
Inferno is in development mode.
INFO  =======================================
 ██╗ ██████╗ █████╗ ██████╗ ██╗   ██╗███████╗
 ██║██╔════╝██╔══██╗██╔══██╗██║   ██║██╔════╝
 ██║██║     ███████║██████╔╝██║   ██║███████╗
 ██║██║     ██╔══██║██╔══██╗██║   ██║╚════██║
 ██║╚██████╗██║  ██║██║  ██║╚██████╔╝███████║
 ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
=============================================
INFO  === Checking package dependencies ===
INFO  === Checking theme configurations ===
WARN  None of the following configuration files is found:
WARN  - D:\dev\stemwith\_config.icarus.yml
WARN  - D:\dev\stemwith\themes\icarus\_config.yml
INFO  Generating theme configuration file...
INFO  D:\dev\stemwith\_config.icarus.yml created successfully.
INFO  To skip configuration generation, use "--icarus-dont-generate-config".
INFO  === Registering Hexo extensions ===
```

<br>

* 이제 블로그 저장소 주소를 설정 파일(_config.yml)에 적어준다.

```[html]
theme: icarus
deploy:
  type: git
  repo: https://github.com/myblog/myblog.github.io
  branch: master
```

<br>

* 로컬에서 확인

```[bash]
hexo server --debug
```

이후, 브라우저에서

```[bash]
http://localhost:4000
```

<br>

* 배포를 위한 hexo-deployer-git 설치

```[bash]
npm i hexo-deployer-git --save
```

이제 hexo generate와 hexo deploy를 사용할 수 있다.

<br>

<br>

### icarus 테마 설정

#### Category list order 설정 (선택사항)

* d:/dev/myblog/node-modules/hexo-generator-category/lib/generator.js 수정

```[html]
module.exports = function(locals) {
  const config = this.config;
  const perPage = config.category_generator.per_page;
  const paginationDir = config.pagination_dir || 'page';
  const orderBy = config.category_generator.order_by || '+date';
```

* orderBy 부분
  * -date : 최근 글 순 (default)
  * +date : 오래된 글 순

<br>

#### 기본 설정

* Site Configuration: _config.yml 수정

```[html]
# Site
title: myblog
subtitle: 'my first blog'
description: 'life diary'
keywords:
author: anonymous
language: ko
timezone: Asia/Seoul

# URL
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: http://[githubID].github.io
```

* Localization re-testing

```[bash]
hexo clean && hexo s
```

<br>

#### Alternative Configuration

_config.yml 에서는 가장 기본적인 셋팅과 테마 설정만 하고. 나머지 설정은 _config.[테마명].yml 에서 수행한다. 

<br>

##### 사용 예시

동일한 설정항목에 대하여 두가지 이상의 설정파일에서 동시에 정의하는 경우, 우선순위에 의해 설정값이 결정된다. 만약 _config.yml, _config.[테마명].yml, themes/[테마명]/ _config.yml 세가지 설정파일이 동시에 존재하는 경우, 각 파일을 아래와 같이 설정했다면,

```[html]
# _config.yml
theme: "my-theme"
```

```[html]
# _config.icarus.yml
bio: "My awesome bio"
foo:
  bar: 'a'
```

```[html]
# themes/icarus/_config.yml
bio: "Some generic bio"
logo: "a-cool-image.png"
  foo:
    baz: 'b'
```

최종적으로 설정되는 값은 각각 다음과 같다.

```[html]
bio: "My awesome bio",
logo: "a-cool-image.png",
foo: {
  bar: "a",
  baz: "b"
```

<br>

<br>

### icarus 테마 셋팅

* 출처: [친성의 블로그](https://chinsun9.github.io/2020/11/20/github-hexo-blog-web-font-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0/) github hexo blog web font 적용하기, hexo icarus 테마에 커스텀 레이아웃, 스타일(css) 적용하기

<br>

#### 폰트 수정

```[html]
// 51 line
const fontCssUrl = {
  default: fontcdn("Ubuntu:wght@400;600&family=Source+Code+Pro", "css2"),
  cyberpunk: fontcdn("Oxanium:wght@300;400;600&family=Roboto+Mono", "css2"),
  nanumgothic: fontcdn("Nanum+Gothic:wght@400&family=Roboto", "css2"),
};
```

```[html]
// 151 line
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href={fontCssUrl['nanumgothic']} rel="stylesheet" />
```

```[html]
$family-sans-serif ?= 'Gowun Dodum', 'Nanum Gothic', Ubuntu, Roboto, 'Open Sans', 'Microsoft YaHei', sans-serif
// $family-sans-serif ?= Ubuntu, Roboto,'Nanum Gothic Coding', 'Open Sans', 'Microsoft YaHei', sans-serif
```

```[html]
$article-font-size ?= 1.2rem
```

- [Google Fonts](https://fonts.google.com/?subset=korean)에서 사용가능한 몇가지 폰트들을 검색해볼 수 있다.
* 이 사이트는 Google Fonts에서 지원하는 Gowun Dodum 폰트를 사용하도록 설정하였다. 이 경우 새로운 폰트 cdn을 import할 필요는 없으나, 특별한 폰트를 원하는 경우에는 아래와 같은 방법으로 새로운 cdn을 import하여야 한다.
  
  ```[html]
  @import url(https://cdn.rawgit.com/innks/NanumSquareRound/master/nanumsquareround.css)
  ```

<br>

#### 가독성 향상

icarus 테마의 포스트 글자 크기나 기본 줄간격이 좋지 않아 가독성이 떨어지는 경향이 있어 아래와 같이 수정한다.

1. 포스트 제목 폰트 변경: &.article 을 검색한 후, .title 추가
   
   ```[html]
   &.article
       .title
           font-size: 2.0em
           font-weight: 700
           letter-spacing: -1.4px;
   ```

2. 포스트 컨텐트 폰트 변경: .content를 검색한 후, 수정
   
   ```[html]
   .content
       font-size: $article-font-size
       line-height: 1.75em;
       letter-spacing: -0.3px;
       color: #5d686f;
       margin-top: 20px;
   ```

3. heading 폰트 변경: h1과 h2만 수정
   
   ```[html]
       h1
               font-size: 1.95em
               font-weight: 600
               margin-top: 50px;
   
       h2
               font-size: 1.5em
               margin-top: 35px;
   ```

<br>

#### 컬럼 비율 조정하기

1. *layout/common/widgets.jsx* 로 가보면 `getColumnSizeClass`라는 함수가 있다
   
   여기에 자신의 *columnCount* 에 맞게 수정한다
   
   columnCount* 의 기본값은 2라서 case 2인 경우를 `is-3`으로 수정

```[html]
function getColumnSizeClass(columnCount) {
  switch (columnCount) {
    case 2:
      return 'is-3-tablet is-3-desktop is-3-widescreen'; // 여기 수정
    case 3:
      return 'is-4-tablet is-4-desktop is-3-widescreen';
  }
  return '';
}
```

2. *layout/layout.jsx* 아래쪽에서 `is-9`로 수정해주었다
   
   - 전체 12에서 기본값은 프로필이 들어있는 영역이 4, 게시글 영역이 8이였다
   
   - 위처럼 수정하게되면 우선 그 비율을 3, 9로 변경해준 것이다
   
   - 프로필 영역을 좁게, 게시글 영역은 크게 바뀐 것이다
   
   - 이 12라는 것은 칼럼들의 상위에 있는 `container`의 크기를 기준으로 12등분한 것이다.

```[html]
<div
  class={classname({
    column: true,
    'order-2': true,
    'column-main': true,
    'is-12': columnCount === 1,
    'is-9-tablet is-9-desktop is-9-widescreen': columnCount === 2, // 여기 수정
    'is-9-tablet is-9-desktop is-6-widescreen': columnCount === 3,
  })}
  dangerouslySetInnerHTML={{ __html: body }}
></div>
```

3. container 크기 늘리기
   
   *include/style/base.styl* 로 가서 23라인 정도에 보이는 아래 코드 중에서 `$widescreen`, `$fullhd`의 값을 각각 200px 씩 늘려준다.

```[html]
$gap ?= 16px
$tablet ?= 769px
$desktop ?= 1288px
$widescreen ?= 1480px
$fullhd ?= 1672px
```

<br>

#### 커스텀 css 적용

##### 이미지 margin 변경

```[html]
&.article
    .article-meta, .article-tags
        color: $text-light

    .article-meta
        overflow-x: auto
        margin-bottom: .5rem

    .article-more
        @extend .button.is-light

    .content
        word-wrap: break-word
        font-size: $article-font-size

        img                     // 여기 추가
            margin-top: 30px    // 여기 추가
```

<br>

#### 변경된 css의 배포 및 적용

- hexo server에서는 최신 css 상태를 반영하는데, 그런데 실제로 배포될 때는 css파일이 갱신이 안된다.
- 그러므로 public/css/default.css 파일을 삭제하고, 다시 `hexo generate`로 생성한 후 배포한다.

<br>

#### link, hover 컬러 변경

* link, link-visited 컬러가 blue와 purple로 지정되어 있는 것이 어울리는것 같지 않아 grey-darker와 grey-light로 변경 

```[html]
// Link colors

$link ?= $grey-darker
$link-invert ?= findColorInvert($link)
$link-light ?= findLightColor($link)
$link-dark ?= findDarkColor($link)
$link-visited ?= $grey-dark

$link-hover ?= $grey-darker
$link-hover-border ?= $grey-light

$link-focus ?= $grey-darker
$link-focus-border ?= $blue

$link-active ?= $grey-darker
$link-active-border ?= $grey-dark
```

<br>

<br>

### Troubleshooting

#### 경로의 대소문자 구분 설정

경로에서 사용하는 폴더나 파일이름의 대소문자 구분 문제로 인해, 파일 인식이 안되는 경우가 발생한다. 특히, generate 시에 아래와 같은 메세지가 여러개 나오면, 대부분 파일이름의 대소문자 구분 문제라고 생각하면 된다.

```[bash]
Markdown Image Path does not exists!
```

이런 경우, 다음과 같은 방법으로 문제를 해결해야 한다.

* _config.yml의 filename_case 수정
  
  ```[bash]
  # Writing
  filename_case: 1
  ```
  
  * 0: 대소문자 구분
  * 1: 경로를 이루는 문자를 모두 소문자로 변경하여 관리
  * 2: 경로를 이루는 문자를 모두 대문자로 변경하여 관리

* github.com에 로그인하여 repository의 categories 폴더 삭제

* d:\dev\myblog\ 폴더의 .deploy_git 폴더 삭제

* hexo clean 후 재배포

* 재배포시에 다음과 같은 에러가 생길 수 있다.
  
  ```[bash]
  fatal: not a git repository (or any of the parent directories): .git
  ```
  
  .deploy_git 폴더의 삭제에 따라, git에 대한 정보를 담은 파일이 없기 때문에 발생하는 에러이며, d:\dev\myblog 폴더에서 다음을 실행한 후,
  
  ```[bash]
  git init
  git remote add
  ```

<br>

이렇게 해도 경로가 인식이 안되는 경우는, Git에서 대소문자를 구분하게 설정하고, 폴더명 및 파일이름의 대소문자를 하나하나 맞춰주어서 해결할 수도 있다.

```[bash]
git config --global core.ignorecase=false
```

<br>

#### 기존 블로그를 복구하는 경우

* 기존에 사용하던 블로그 디렉토리가 d:\dev\myblog 인 경우, d:\dev 폴더 전체를 다른 폴더에 복사하여 백업해두고 아래의 과정을 진행한다.
* 백업 완료 후, 기존에 사용하던 d:\dev\ 폴더 자체를 삭제한 후, 아래의 과정을 수행하여 모든 설치를 마친 뒤, 백업해둔 myblog 폴더에서 필요한 부분을 복구함.

<br>

#### favicon이 안나오는 경우

로컬 테스트시 favicon이 출력되지만, github 배포시 출력되지 않는다면

```[markdown]
head:
  # URL or path to the website's icon
  favicon: /img/favicon.png?
  # Open Graph metadata
```

_*config.icarus.yml* 에서 상단에 favicon을 설정하는 부분에서 favicon.png 끝에 `?`를 추가한 후, 재배포 한다.



#### generate할 때 에러가 뜨는 경우

```
$ hexo g
INFO  Validating config
Inferno is in development mode.
ERROR {
  err: TypeError: Cannot read properties of undefined (reading 'split')
```

해결방법

```
cd d:\dev\myblog
npm install hexo-html-syncer --save
npm audit fix --force
npm fund
```

<br>이후에 다시 generate 한다.

<br>

<br>

### 블로그 포스트 생성

1. test.md 파일을 만든 뒤, d:/dev/stemwith/source/_post/ 폴더에 복사
   
   test.md 파일의 가장 앞부분에 들어가는 post front-matter는 다음과 같이 구성한다.
   
   ```[markdown]
   ---
   title: test 블로그 페이지
   date: 2019-09-17 01:32:35
   updated: 
   category:
     - blog
   tags:
     - hexo
     - blog
   toc: true
   thumbnail: /images/preview.jpg
   ---
   ```
   
   * toc: true를 추가하면 헤딩 태그(h1~h6)를 통해 목차를 만들어 준다. (icarus 테마의 경우)

2. 로컬에서 페이지 확인
   
   ```[bash]
   hexo serve
   http://localhost:4000
   ```

3. 로컬 작업 내용을 github 도메인으로 배포 (push)
   
   ```[bash]
   hexo generate
   hexo deploy
   ```
   
   or
   
   ```[bash]
   hexo g -d
   ```

4. deploy 후에도 오랜시간 업데이트가 안된다면, 페이지 clean 후 재배포
   
   ```[bash]
   hexo clean
   hexo deploy --generate
   ```

<br>

<br>

### Code fence

```[html]
``` [language] [title] [url] [link text] [additional options]
code snippet
```

{% codeblock [title] [lang:language] [url] [link text] [additional options] %}
code snippet
{% endcodeblock %}

{% code [title] [lang:language] [url] [link text] [additional options] %}
code snippet
{% endcode %}

```
* 첫번째 라인에

```[markdown]
``` [C++] 파일이름
```

과 같이 적어주면 코드박스 상단에 파일이름이 표시된다.

* 파일이름은 [ ]로 감싸게 되면, [ ]까지 출력된다.
* typora에서는 `````를 먼저 입력한 뒤, 코드박스가 나타나면, 코드박스 하단의 language 입력란에 입력한다.

<br>

<br>

### about 페이지 만들기

아래 명령을 통해 source/about/index.md을 생성한 후, 파일을 수정하여 사용한다.

```[bash]
hexo new page "about"
```

<br>

<br>

### 사진 첨부 방법

1. 첨부할 사진 파일 위치 : 사진 파일을 d:/dev/stemwith/source/image/ 폴더에 복사

2. 마크다운 파일에서 파일 위치를 다음과 같이 지정함 지정함
   
   ```[markdown]
   {{< figure src="/image/~~~.jpg" alt="사진첨부파일설명" width="50%" class="center" >}}
   ```

3. 사진 출력시 사이즈 조정
   
   * icarus, next 테마 사용시에는 사진 사이즈 조정이 필요한 경우, img 태그를 사용하여 zoom 수치로 조정하여야 함
   
   ```[html]
   {{< figure src="/image/test.png" width="80%" class="center" >}}
   ```
   
   * book 테마 사용시에는 아래와 같이 하면 화면에 출력되는 크기를 조정할 수 있다. (단, icarus, Next 테마와 같은 방법을 사용해도 된다.)
   
   ```[markdown]
   {{< figure src="/image/~~~.png =432x768" alt="사진첨부파일설명" width="50%" class="center" >}}
   ```

4. 주의 사항
   
   * 필요한 경우, hexo-image-link-with-display-size 설치
   
   ```[bash]
   npm i hexo-image-link-with-display-size
   ```
   
   - 사진이 위치한 폴더를 지정할 때, /image/ 폴더 앞에 점(.) 같은 것을 추가하면 안됨
   
   - 파일이름에 언더바(_)가 포함되면 안됨. 대시(-)는 가능

<br>

<br>

### Github 블로그 구글 검색 노출

※ 출처: [내 github blog 글이 구글 검색에 나오는 법(친성의 블로그)](https://chinsun9.github.io/2020/09/23/%EB%82%B4-github-blog-%EA%B8%80%EC%9D%B4-%EA%B5%AC%EA%B8%80-%EA%B2%80%EC%83%89%EC%97%90-%EB%82%98%EC%98%A4%EB%8A%94-%EB%B2%95/)

<br>

#### blog 설정

##### SEO (search engine optimization) 설정

블로그 설치 폴더가 d:\dev\myblog 인 경우, d:\dev\myblog 폴더에서

```[bash]
npm i hexo-autonofollow
npm i hexo-generator-feed
npm i hexo-generator-seo-friendly-sitemap
npm i hexo-generator-robotstxt
```

필요한 경우 hexo-auto-canonical과 hexo-component-inferno을 추가로 설치한다.

```[bash]
npm i hexo-auto-canonical
npm i hexo-component-inferno
```

설치 후

```[bash]
npm audit fix
```

<br>

※ 표준링크 확인 방법

1. 본인 블로그로 접속

2. F12로 개발자도구를 열고

3. 개발자도구 상단의 **요소**를 클릭한 뒤,

4. Ctrl-F를 눌러 **canonical**를 검색했을 때, 아래 형태의 링크 태그가 검색이 되면, 이미 표준링크가 생성되고 있는 것임. 이런 경우에는 hexo-auto-canonical은 설치하지 않아도 됨!
   
   ```html
   <link rel="canonical" href="http://블로그 글 주소/"
   ```

5. NEXT 테마의 경우, (이미 표준링크를 생성하고 있으므로) hexo-auto-canonical은 설치하지 않아도 됨 

<br>

##### _config.yml 설정

_config.yml 최하단 deploy 설정 아래에 다음을 추가

```[markdown]
nofollow:
  enable: true
  exclude:
    - exclude1.com
    - exclude2.com
feed:
  type: rss2
  path: rss2.xml
  limit: 20
sitemap:
  path: sitemap.xml
  tag: false
  category: false
robotstxt:
  useragent: '*'
  allow:
    - /
  sitemap: https://깃허브유저네임.github.io/sitemap.xml
```

<br>

##### 배포

```[bash]
hexo g -d
```

<br>

##### 생성된 파일 확인하기

d:\dev\myblog\public\ 디렉터리 하단에 rss2.xml, sitemap.xml, robots.txt 이 3개의 파일이 보이는지 확인한다.

<br>

<br>

#### 검색 노출

##### 구글 검색 엔진 등록

1. [Google Search Console](https://search.google.com/search-console/about) 에 접속후 시작하기 클릭

2. **URL 접두어**를 선택하고, **자신의 깃헙 주소** (예, https://testblog.github.io)를 입력한 뒤 **계속** 클릭

3. 소유권 확인
   
   1. html 파일 다운로드
   2. (_config.yml 이 위치한) d:\dev\myblog\public\ 디렉토리에 다운 받은 파일을 넣고
   3. hexo d 로 배포
   4. 잠시 대기 후, 소유권 확인 과정 창의 **확인** 클릭 (확인이 안된다고 나오는 경우에는 잠시 후에 다시 시도 해야 함)
   5. 소유권이 확인되면, **속성으로 이동** 클릭

4. Google Search Console에서
   
   1. 왼쪽 메뉴의 **sitemaps** 클릭
   2. 새 사이트맵 추가에서 **sitemap.xml** 입력 후 **제출** 클릭
   3. 새 사이트맵 추가에서 **rss2.xml** 입력 후 **제출** 클릭
   4. 두 파일의 제출 상태가 **성공**으로 표시되어야 함 (**가져올 수 없음** 이라고 나오면 잠시 후에 페이지 새로고침을 해보고, 성공으로 표시되는지 확인이 필요함)

5. 실제 검색은 하루 정도 지나면 가능

<br>

##### Naver 검색 노출

1. 구글과 유사하며, 네이버 웹마스터 도구 (Naver Search Advisor)를 사용하여 등록함
2. RSS 제출 메뉴와 사이트맵 제출 메뉴가 분리되어 있으므로, sitemap.xml 및 rss2.xml 등록시 유의

<br>

##### Daum 검색 노출

1. [Daum 검색등록](https://register.search.daum.net/index.daum)으로 들어가서
2. 신규 등록에 블로그 URL을 등록한 뒤 **확인**을 클릭하여 제출하면, 심사 후 이메일로 등록 결과를 알려줌

<br>

<br>

#### Mathjax & KaTeX 설정

* _config.[테마].yml 설정

```[markdown]
math:
    enable: false
  ...
  katex:
    enable: true
    # See: https://github.com/KaTeX/KaTeX/tree/master/contrib/copy-tex
    copy_tex: true
```

​        math: enable: false 상태에서는 필요한 렌더링이 필요한 페이지의 front matter에 **mathjax: true**를 넣어주어야 한다.

```[markdown]
---
title: Will Render Math
mathjax: true
---
```

<br>

#### Google Analytics 설정

```[html]
# Google Analytics
# See: https://analytics.google.com
google_analytics:
  tracking_id: UA-*********-1          // google analytics 계정 s○○○○○○○@○○○○○○○.com
```
