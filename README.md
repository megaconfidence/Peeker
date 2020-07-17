# Peeker
_Peeker_ is my version of `google keep` built with react and nodejs. It is fast, works offline, has reminder feature and supports image upload. Oh, it even allows you to login with facebook!

## Repo Information
- This project is built using `crate react app`, so it is a react based application
- `cra-append-sw` is used for adding custom service-worker logic
- `axios` is used for making API calls to the backend ([link to backend repo](https://github.com/Confidence-Okoghenun/Peeker-API))
- This project is currently hosted on `netlify`. Here is the link [peeker.netlify.app](https://peeker.netlify.app)

## Build And Deploy
As mentioned earlier this project is built using `create react app` and comes with the standard build commands
```
$ yarn start #starts off local dev server

$ yarn build #optimizes the project for deploy and outputs to /build

$ yarn mobile #sets off dev server to allow access via ip on other local devices
```

Connect the project to your hosting provider (i.e netlify or vercel) and they will handle the deploy process for you

## Project Road Map
This is the roadmap of the project for the foreseeable future:
- [x] Release first stable version
- [x] Offline capable with PWA
- [x] Support in-app reminders
- [x] Implement image upload
- [x] Build a cool landing page