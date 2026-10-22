import {useState, useEffect} from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [nome, setNome] = useState('')
const [registros, setRegistros] = useState(() => {
  const registrosSalvos = localStorage.getItem('registros')
  return registrosSalvos ? JSON.parse(registrosSalvos) : []
})
useEffect(() => {
  localStorage.setItem('registros', JSON.stringify(registros))
}, [registros])
  const nomelimpo= nome.trim()
  const [categoria, setCategoria] = useState('')
  const categorialimpa= categoria.trim()
  const [busca, setBusca] = useState('')
  const [totalPesquisas, setTotalPesquisas] = useState(0)
  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [ordem, setOrdem] = useState('recentes')
  const registrosFiltrados = registros.filter((registro) => {
  const correspondeBusca =
    registro.nome.toLowerCase().includes(busca.toLowerCase()) ||
    registro.categoria.toLowerCase().includes(busca.toLowerCase())

  const correspondeCategoria =
    filtroCategoria === 'todas' ||
    registro.categoria === filtroCategoria

  return correspondeBusca && correspondeCategoria
})

const registrosOrdenados = [...registrosFiltrados].sort((a, b) => {
  if (ordem === 'alfabetica') {
    return a.nome.localeCompare(b.nome, 'pt-BR')
  }

  return 0
})

const totalRegistros = registros.length
function Card ({children}) {
  return (  
    <div className="card">
      {children}
    </div>
  )
}
const totalCategorias = new Set(
  registros.map((registro) => registro.categoria)
).size
const mudarnomederegistro = (e) => {
  setNome(e.target.value)
}

const mudarcategoriaderegistro = (e) => {
  setCategoria(e.target.value)
}
const [idEdicao, setIdEdicao] = useState(null)
const cancelarEdicao = () => {
  setIdEdicao(null);
  setNome('');
  setCategoria('');
}

const exportarCSV = () => {
  if (registros.length === 0) {
  alert('Não há registros para exportar.');
  return;
}
  const cabecalho = ['Nome', 'Categoria'];

  const linhas = registros.map((registro) => [
    registro.nome,
    registro.categoria
  ]);

  const conteudo = [cabecalho, ...linhas]
    .map((linha) =>
      linha
        .map((valor) => `"${String(valor).replace(/"/g, '""')}"`)
        .join(';')
    )
    .join('\n');

  const arquivo = new Blob(
    ['\uFEFF' + conteudo],
    { type: 'text/csv;charset=utf-8;' }
  );

  const link = document.createElement('a');
  const url = URL.createObjectURL(arquivo);

  link.href = url;
  link.download = 'registros-datalab.csv';
  link.click();

  URL.revokeObjectURL(url);
};

const dadosGrafico = Object.values(
  registrosFiltrados.reduce((grupos, registro) => {
    const categoria = registro.categoria;

    if (!grupos[categoria]) {
      grupos[categoria] = {
        categoria: categoria,
        quantidade: 0
      };
    }

    grupos[categoria].quantidade++;

    return grupos;
  }, {})
);

return (
  <>
   <header>
  <nav className="navbar">
    <div className="navbar-container">
      <div className="navbar-logo">
        <img
          src="/img/logo.png"
          alt="Logo DataLab"
          className="logo"
        />
      </div>

      <div className="busca">
        <img
          src="/img/search.png"
          alt=""
          className="icone-busca"
        />

        <input
          type="text"
          value={busca}
          placeholder=" "
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </div>
  </nav>
</header>
  <main className="container">
    <section className="cabecalho">

<div className="cards-resumo">
  <Card>
    <p>Total de registros: {totalRegistros}</p>
  </Card>

  <Card>
    <p>Total de categorias: {totalCategorias}</p>
  </Card>
</div>

<section className="grafico-container">
  <h2>Registros por categoria</h2>

  {dadosGrafico.length === 0 ? (
    <p>Cadastre registros para visualizar o gráfico.</p>
  ) : (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dadosGrafico}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="categoria" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="quantidade" fill="#4ac3ff" />
      </BarChart>
    </ResponsiveContainer>
  )}
</section>

        
        
<div className="ordenacao">
  <label htmlFor="ordem-registros">Ordenar registros:</label>

  <select
    id="ordem-registros"
    value={ordem}
    onChange={(e) => setOrdem(e.target.value)}
  >
    <option value="recentes">Ordem atual</option>
    <option value="alfabetica">Ordem alfabética</option>
  </select>
</div>
<div className="ordenacao">
  <label htmlFor="filtroCategoria">
    Filtrar por categoria:
  </label>

  <select
    id="filtroCategoria"
    value={filtroCategoria}
    onChange={(e) => setFiltroCategoria(e.target.value)}
  >
    <option value="todas">Todas as categorias</option>

    {[...new Set(registros.map((registro) => registro.categoria))].map(
      (categoria) => (
        <option key={categoria} value={categoria}>
          {categoria}
        </option>
      )
    )}
  </select>
</div>
       
<button
  className="botao-principal"
  onClick={exportarCSV}
>
  Exportar CSV
</button>

      </section>
      <div className="formulario">
      <input type="text" 
      value={nome} 
      placeholder="Digite o nome do registro"
      onChange={mudarnomederegistro} /> 
      <input type="text" value={categoria} placeholder="Digite a categoria do registro" onChange={mudarcategoriaderegistro} />
      <p>Nome do registro: {nomelimpo}</p>
      <p>Categoria do registro: {categorialimpa}</p>
      <button className="botão-envio" onClick={() => {
  if (nomelimpo === '' || categorialimpa === '') {
    alert('Preencha o nome e a categoria.');
    return;
  }

 if (idEdicao !== null) {
  const registrosAtualizados = registros.map((registro) =>
    registro.id === idEdicao
      ? {
          ...registro,
          nome: nomelimpo,
          categoria: categorialimpa
        }
      : registro
  );

  setRegistros(registrosAtualizados);
  setIdEdicao(null);
} else {
    setRegistros([
      ...registros,
      {
      id: crypto.randomUUID(),
      nome: nomelimpo, 
      categoria: categorialimpa }
    ]);
  }

  setNome('');
  setCategoria('');
}} >
        {idEdicao !== null ? 'Salvar alterações' : 'Enviar'}
      </button>
      {idEdicao !== null && (
  <button onClick={cancelarEdicao}>
    Cancelar edição
  </button>
)}
     {registros.length === 0 ? (
  <p>Nenhum registro cadastrado.</p>
) : registrosFiltrados.length === 0 ? (
  <p>Nenhum resultado para esta busca.</p>
) : (
  <p>Registros encontrados: {registrosFiltrados.length}</p>
)}
<ul>
 
{registrosOrdenados.map((registro) => (
  <li key={registro.id}>
    <span className="registro-texto">
      {registro.nome} - {registro.categoria}
    </span>

    <div className="registro-botoes">
      <button
        onClick={() =>
          setRegistros(
            registros.filter((r) => r.id !== registro.id)
          )
        }
      >
        Excluir
      </button>

      <button
        onClick={() => {
          setIdEdicao(registro.id);
          setNome(registro.nome);
          setCategoria(registro.categoria);
        }}
      >
        Editar
      </button>
    </div>
  </li>
))}
</ul>
      </div>
 </main>
  </>
)
}
export default App