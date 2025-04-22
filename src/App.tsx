import { useEffect, useState, useCallback, FormEvent } from 'react';
import { Building2, Phone, Mail, Facebook, Instagram, Linkedin as LinkedIn, FileText, Globe2, Clock, MessageCircle, ExternalLink, Menu, X, FileDown } from 'lucide-react';

// Configuração necessária para o react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ClassificationFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  description: string;
  function: string;
  specificUse?: string;
  material: string;
  mainFunction?: string;
  electricalSpecs?: string;
}

function App() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [, setIsScrolled] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const [showClassificationForm, setShowClassificationForm] = useState(false);
  const [showPricesPopup, setShowPricesPopup] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [] = useState<number | null>(null);
  const [] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<ClassificationFormData>({
    fullName: '',
    email: '',
    whatsapp: '',
    description: '',
    function: '',
    specificUse: '',
    material: '',
    mainFunction: '',
    electricalSpecs: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWhatsApp(e.target.value);
    setFormData({ ...formData, whatsapp: formattedValue });
  };

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 50);

    const footer = document.querySelector('footer');
    if (footer) {
      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      setShowWhatsApp(footerTop > windowHeight);
    }

    const reveals = document.querySelectorAll('.reveal, .stagger-children > *');
    reveals.forEach((reveal) => {
      const revealTop = (reveal as HTMLElement).getBoundingClientRect().top;
      const revealPoint = 150;

      if (revealTop < window.innerHeight - revealPoint) {
        reveal.classList.add('active');
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRate(data.rates.BRL);
      } catch (error) {
        console.error('Erro ao buscar taxa de câmbio:', error);
      }
    };

    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 300000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openNeshPdf = () => {
    window.open('/Nesh 2022 - REGRAS INTERPRETATIVAS DO SISTEMA HARMONIZADO.pdf', '_blank');
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Nome Completo', formData.fullName);
      formDataToSend.append('Email', formData.email);
      formDataToSend.append('WhatsApp', formData.whatsapp);
      formDataToSend.append('Descrição Detalhada', formData.description);
      formDataToSend.append('Função do Produto', formData.function);
      formDataToSend.append('Uso Específico', formData.specificUse || 'Não informado');
      formDataToSend.append('Material Constitutivo', formData.material);
      formDataToSend.append('Função Principal', formData.mainFunction || 'Não informado');
      formDataToSend.append('Especificações Elétricas', formData.electricalSpecs || 'Não informado');

      const response = await fetch('https://formspree.io/f/xgvajvbk', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Sua solicitação foi enviada com sucesso! Em breve entraremos em contato.'
        });

        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            whatsapp: '',
            description: '',
            function: '',
            specificUse: '',
            material: '',
            mainFunction: '',
            electricalSpecs: ''
          });
          setShowClassificationForm(false);
          setSubmitStatus({ type: null, message: '' });
        }, 3000);
      } else {
        throw new Error('Erro ao enviar o formulário');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error 
          ? `Erro ao enviar: ${error.message}`
          : 'Erro ao enviar sua solicitação. Por favor, tente novamente mais tarde ou entre em contato diretamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            WebkitBackdropFilter: 'blur(10px)',
            backdropFilter: 'blur(10px)',
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)',
            WebkitPerspective: '1000',
            perspective: '1000',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      </div>
      {/* Header */}
      <div className="header-container bg-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/Bonuzzi.png" alt="Logo Bonuzzi" className="h-8 w-8" />
              <span className="text-lg font-bold text-gray-800">Leandro Bonuzzi</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex gap-4">
                <a href="#servicos" className="nav-link text-sm text-gray-600 hover:text-blue-600">
                  Serviços
                </a>
                <a href="#portfolio" className="nav-link text-sm text-gray-600 hover:text-blue-600">
                  Portfólio
                </a>
                <a href="#faq" className="nav-link text-sm text-gray-600 hover:text-blue-600">
                  FAQ
                </a>
                <a href="#apoio" className="nav-link text-sm text-gray-600 hover:text-blue-600">
                  Links de Apoio
                </a>
                <a href="#contato" className="nav-link text-sm text-gray-600 hover:text-blue-600">
                  Contato
                </a>
              </nav>
              <div className="dollar-widget bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-2">
                <div className="text-xs font-semibold text-gray-600">
                  USD/BRL
                </div>
                <div className="rate text-sm font-bold text-blue-600">
                  {exchangeRate ? `R$ ${exchangeRate.toFixed(2)}` : 'Carregando...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`fixed inset-0 bg-white mobile-menu transition-transform duration-300 ease-in-out transform ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden z-50`}
          style={{ top: '64px' }}
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <a
                href="#servicos"
                className="mobile-nav-link text-base py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeMobileMenu}
              >
                Serviços
              </a>
              <a
                href="#portfolio"
                className="mobile-nav-link text-base py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeMobileMenu}
              >
                Portfólio
              </a>
              <a
                href="#faq"
                className="mobile-nav-link text-base py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeMobileMenu}
              >
                FAQ
              </a>
              <a
                href="#apoio"
                className="mobile-nav-link text-base py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeMobileMenu}
              >
                Links de Apoio
              </a>
              <a
                href="#contato"
                className="mobile-nav-link text-base py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={closeMobileMenu}
              >
                Contato
              </a>
              <button
                onClick={() => {
                  setShowClassificationForm(true);
                  closeMobileMenu();
                }}
                className="mobile-nav-link text-base py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                Solicitar classificação
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-20 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center hero-content">
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-gray-900 mb-4 md:mb-6">
            Consultor Aduaneiro
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Empresário individual na área de comércio exterior com mais de 15 anos
            de experiência no mercado, oferecendo consultoria aduaneira na área de importação, 
            com foco em classificação fiscal de mercadorias (NCM) e desenvolvimento, revisão e gerenciamento de produtos em conformidade ao novo catalogo de produtos da Receita Federal, Duimp.
          </p>
          <button
            onClick={openNeshPdf}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-200 w-full sm:w-auto"
          >
            <FileDown className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">REGRAS INTERPRETATIVAS DO SISTEMA HARMONIZADO</span>
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 reveal">Nossos Serviços</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 stagger-children">
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal">
              <div className="mb-4"><FileText className="h-6 w-6 md:h-8 md:w-8 text-blue-600" /></div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Classificação Fiscal</h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base">Análise e determinação precisa do NCM/SH para suas mercadorias, garantindo conformidade e otimização tributária.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowPricesPopup(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Preços
                </button>
                <button
                  onClick={() => setShowClassificationForm(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Solicitar Classificação
                </button>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal">
              <div className="mb-4"><Globe2 className="h-6 w-6 md:h-8 md:w-8 text-blue-600" /></div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Desenvolvimento, adequação e gestão</h3>
              <p className="text-gray-600 text-sm md:text-base">Descrição de mercadorias importadas para o novo catálogo de produtos da Receita Federal, em conformidade ao novo processo de importação - (Duimp).</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal">
              <div className="mb-4"><Clock className="h-6 w-6 md:h-8 md:w-8 text-blue-600" /></div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Consultoria em Importação</h3>
              <p className="text-gray-600 text-sm md:text-base">Orientação especializada em processos de importação, análise de custos e viabilidade operacional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prices Popup */}
      {showPricesPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 md:p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Tabela de Preços</h2>
              <button
                onClick={() => setShowPricesPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 md:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Quantidade
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Preço
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Prazo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        0-10
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        R$ 100,00
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        01 DIA
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        11-20
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        R$ 180,00
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        02 DIAS
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        21-40
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        R$ 300,00
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        03 DIAS
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        41-50
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        R$ 350,00
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        05 DIAS
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ACIMA DE 50
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        A COMBINAR
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        A COMBINAR
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      {showWhatsApp && (
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}

      {/* Classification Form Popup */}
      {showClassificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Solicitar Classificação Fiscal</h3>
              <button
                onClick={() => setShowClassificationForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleFormSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                      Número de WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleWhatsAppChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição detalhada em Português *
                    </label>
                    <textarea
                      id="description"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Inclua marca, modelo e demais referências"
                    />
                  </div>

                  <div>
                    <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-1">
                      Função do produto *
                    </label>
                    <textarea
                      id="function"
                      required
                      value={formData.function}
                      onChange={(e) => setFormData({ ...formData, function: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Para que serve, como trabalha"
                    />
                  </div>

                  <div>
                    <label htmlFor="specificUse" className="block text-sm font-medium text-gray-700 mb-1">
                      Uso específico (opcional)
                    </label>
                    <input
                      type="text"
                      id="specificUse"
                      value={formData.specificUse}
                      onChange={(e) => setFormData({ ...formData, specificUse: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Se é produto específico do equipamento ou máquina, informar onde é usado"
                    />
                  </div>

                  <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                      Material constitutivo *
                    </label>
                    <input
                      type="text"
                      id="material"
                      required
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="borracha, aço, ferro, etc"
                    />
                  </div>

                  <div>
                    <label htmlFor="mainFunction" className="block text-sm font-medium text-gray-700 mb-1">
                      Função principal (opcional)
                    </label>
                    <input
                      type="text"
                      id="mainFunction"
                      value={formData.mainFunction}
                      onChange={(e) => setFormData({ ...formData, mainFunction: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Se for mercadoria composta, Kit ou conjunto"
                    />
                  </div>

                  <div>
                    <label htmlFor="electricalSpecs" className="block text-sm font-medium text-gray-700 mb-1">
                      Especificações elétricas (opcional)
                    </label>
                    <input
                      type="text"
                      id="electricalSpecs"
                      value={formData.electricalSpecs}
                      onChange={(e) => setFormData({ ...formData, electricalSpecs: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tensão (V), Potência (W), Corrente (A)"
                    />
                  </div>
                </div>

                {submitStatus.message && (
                  <div className={`mt-4 p-3 rounded-md ${
                    submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowClassificationForm(false)}
                    className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 reveal">Casos de Sucesso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12 stagger-children">
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800"
                alt="Container terminal"
                className="w-full h-40 md:h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Otimização de Processos Aduaneiros</h3>
              <p className="text-gray-600 text-sm md:text-base">Redução de 40% no tempo de liberação de cargas através de análise preventiva e gestão eficiente.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal">
              <img 
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800"
                alt="Documentos e análise"
                className="w-full h-40 md:h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Economia em Classificação Fiscal</h3>
              <p className="text-gray-600 text-sm md:text-base">Economia significativa em impostos através da correta classificação fiscal de produtos para grandes empresas multinacionais.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal">
              <img 
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800"
                alt="Processo Ex-Tarifário"
                className="w-full h-40 md:h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg md:text-xl font-semibold mb-2">Consultoria para Ex-Tarifário</h3>
              <p className="text-gray-600 text-sm md:text-base">Consultoria para redução de impostos na importação via Ex-Tarifário, com gestão completa do processo</p>
            </div>
          </div>
          <div className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center stagger-children">
              <div className="transform transition-all duration-300 hover:scale-110 reveal">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">1000+</div>
                <p className="text-gray-600">Processos Realizados por ano</p>
              </div>
              <div className="transform transition-all duration-300 hover:scale-110 reveal">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">15+</div>
                <p className="text-gray-600">Anos de Experiência</p>
              </div>
              <div className="transform transition-all duration-300 hover:scale-110 reveal">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">98%</div>
                <p className="text-gray-600">Taxa de Sucesso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 reveal">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 stagger-children">
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg reveal">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-2">Como é feita a classificação fiscal de mercadorias?</h3>
              <p className="text-gray-600 text-sm md:text-base">A classificação é realizada através de análise detalhada das características do produto, 
                consulta à TEC (Tarifa Externa Comum) e aplicação das Regras Gerais de Interpretação do Sistema Harmonizado.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg reveal">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-2">Qual o tempo médio para desembaraço aduaneiro?</h3>
              <p className="text-gray-600 text-sm md:text-base">O prazo varia conforme o canal de parametrização (verde, amarelo, vermelho ou cinza), 
                mas com nossa gestão eficiente, conseguimos reduzir significativamente os tempos médios de liberação.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg reveal">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-2">Como posso reduzir custos na importação?</h3>
              <p className="text-gray-600 text-sm md:text-base">Através de análise prévia da classificação fiscal, planejamento tributário adequado, 
                e gestão eficiente do processo de desembaraço, evitando multas e atrasos.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg reveal">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-2">Quais documentos são necessários para iniciar uma importação?</h3>
              <p className="text-gray-600 text-sm md:text-base">Os principais documentos incluem Fatura Comercial, Packing List, Conhecimento de Embarque (BL/AWB), 
                Licença de Importação (quando aplicável) e documentos específicos conforme a natureza da mercadoria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Links de Apoio Section */}
      <section id="apoio" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 reveal">Links de Apoio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 stagger-children">
            <a 
              href="https://portalunico.siscomex.gov.br/classif/#/sumario?origem=menu&perfil=publico"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal"
            >
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <h3 className="text-base md:text-lg font-semibold">Consulta NCM - Receita Federal</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base">Consulte descrições e códigos NCM no Portal Único do Siscomex.</p>
            </a>
            
            <a 
              href="http://www4.receita.fazenda.gov.br/simulador/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal"
            >
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <h3 className="text-base md:text-lg font-semibold">Simulador de Impostos</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base">Calcule uma estimativa dos impostos na importação pela Receita Federal.</p>
            </a>
            
            <a 
              href="https://www.gov.br/siscomex/pt-br/noticias/noticias-siscomex-importacao"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal"
            >
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <h3 className="text-base md:text-lg font-semibold">Notícias Siscomex</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base">Acompanhe as últimas notícias e atualizações do sistema Siscomex.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 reveal">Entre em Contato</h2>
          <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-sm p-4 md:p-8 rounded-lg shadow-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl reveal">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-sm md:text-base">+55 11 99417-3962</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm md:text-base">leandrobonuzzi@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/Bonuzzi.png" alt="Logo Bonuzzi" className="h-8 w-8" />
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold">Leandro Bonuzzi Servicos Administrativos</span>
                <span className="text-xs md:text-sm text-gray-400">Consultor Aduaneiro – Classificador Fiscal de Mercadorias</span>
                <span className="text-xs md:text-sm text-gray-400">CNPJ: 30.021.972/0001-23</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transform transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transform transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transform transition-all duration-300 hover:scale-110">
                <LinkedIn className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-0">
                © 2024 Leandro Bonuzzi Servicos Administrativos. Todos os direitos reservados.
              </p>
              <div className="flex space-x-4 text-xs md:text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors duration-300">Política de Privacidade</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Termos de Serviço</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full h-[90vh] max-w-6xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">REGRAS INTERPRETATIVAS DO SISTEMA HARMONIZADO</h3>
              <button
                onClick={() => setShowPdfViewer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src="/PDF/Nesh 2022 - REGRAS INTERPRETATIVAS DO SISTEMA HARMONIZADO.pdf"
                className="w-full h-full"
                title="REGRAS INTERPRETATIVAS DO SISTEMA HARMONIZADO"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;