// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { config } from './app/app.config.server';

// const bootstrap = () => bootstrapApplication(AppComponent, config);

// export default bootstrap;

// import { renderModule } from '@angular/platform-server';
// import { AppModule } from './app/app.module';

// export default (req: any) => {
//   return renderModule(AppModule, {
//     url: req.url,
//   });
// };
import { AppServerModule } from './app/app.server.module';

export default AppServerModule;
