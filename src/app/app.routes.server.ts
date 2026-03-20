import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
<<<<<<< HEAD
    renderMode: RenderMode.Server
=======
    renderMode: RenderMode.Prerender
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3
  }
];
