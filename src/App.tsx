import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useMemo } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { FiltersContext, useFiltersState } from '@/hooks/useFilters'
import ExecutiveSummary from '@/components/modules/ExecutiveSummary'
import CalidadCartera from '@/components/modules/CalidadCartera'
import CicloVida from '@/components/modules/CicloVida'
import ApetitoRiesgo from '@/components/modules/ApetitoRiesgo'
import Rentabilidad from '@/components/modules/Rentabilidad'
import Segmentacion from '@/components/modules/Segmentacion'
import Alertas from '@/components/modules/Alertas'
import Modelos from '@/components/modules/Modelos'

function Layout() {
  const filtersValue = useFiltersState()
  const contextValue = useMemo(() => filtersValue, [filtersValue])

  return (
    <FiltersContext.Provider value={contextValue}>
      <div className="flex h-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto p-6">
              <Routes>
                <Route path="/" element={<ExecutiveSummary />} />
                <Route path="/calidad-cartera" element={<CalidadCartera />} />
                <Route path="/ciclo-vida" element={<CicloVida />} />
                <Route path="/limites-riesgo" element={<ApetitoRiesgo />} />
                <Route path="/apetito-riesgo" element={<ApetitoRiesgo />} />
                <Route path="/rentabilidad" element={<Rentabilidad />} />
                <Route path="/segmentacion" element={<Segmentacion />} />
                <Route path="/alertas" element={<Alertas />} />
                <Route path="/modelos" element={<Modelos />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </FiltersContext.Provider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
