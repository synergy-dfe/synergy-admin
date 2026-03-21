import { RouterProvider } from "react-router-dom";
import { ProvedorAutenticacao } from "../contextos/ContextoAutenticacao";
import { ProvedorWorkspace } from "../contextos/ContextoWorkspace";
import { ProvedorAplicacoes } from "../contextos/ContextoAplicacoes";
import { ProvedorTema } from "../contextos/ContextoTema";
import { ProvedorSidebar } from "../contextos/ContextoSidebar";
import { router } from "./router";
import "../estilos/design-system.css";
import "../estilos/global.css";

function App() {
  return (
    <ProvedorTema>
      <ProvedorAutenticacao>
        <ProvedorWorkspace>
          <ProvedorSidebar>
            <ProvedorAplicacoes>
              <RouterProvider router={router} />
            </ProvedorAplicacoes>
          </ProvedorSidebar>
        </ProvedorWorkspace>
      </ProvedorAutenticacao>
    </ProvedorTema>
  );
}

export default App;
