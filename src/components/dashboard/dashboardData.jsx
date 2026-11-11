import React from "react";
export const kpiData = [
  {
    id: 'visits',
    title: 'Visitas Totais',
    icon: 'visibility',
    iconColor: 'text-primary',
    iconBg: 'bg-surface-container-high',
    value: '12.450',
    trend: '+5.2%',
    trendType: 'up',
    trendText: 'vs mês anterior',
    subtitle: 'Média de ~415/dia'
  },
  {
    id: 'orders',
    title: 'Pedidos Fechados',
    icon: 'check_circle',
    iconColor: 'text-tertiary',
    iconBg: 'bg-surface-container',
    value: '348',
    trend: '+2.1%',
    trendType: 'up',
    trendText: 'vs mês anterior',
    subtitle: '11 a 18 pedidos/dia'
  },
  {
    id: 'revenue',
    title: 'Receita Bruta',
    icon: 'payments',
    iconColor: 'text-tertiary-container',
    iconBg: 'bg-surface-container',
    value: 'R$ 52.200,00',
    trend: '+8.4%',
    trendType: 'up',
    trendText: 'vs mês anterior',
    subtitle: 'Faturamento consolidado'
  },
  {
    id: 'ticket',
    title: 'Ticket Médio',
    icon: 'receipt_long',
    iconColor: 'text-primary',
    iconBg: 'bg-surface-container-high',
    value: 'R$ 150,00',
    trend: '+1.5%',
    trendType: 'up',
    trendText: 'vs mês anterior',
    subtitle: 'Por transação aprovada'
  },
  {
    id: 'conversion',
    title: 'Taxa Conversão',
    icon: 'ads_click',
    iconColor: 'text-primary',
    iconBg: 'bg-surface-container-high',
    value: '2,79%',
    trend: '+0.15 p.p.',
    trendType: 'up',
    trendText: '',
    subtitle: 'Visitas → Pedidos'
  },
  {
    id: 'abandonment',
    title: 'Abandono Carrinho',
    icon: 'remove_shopping_cart',
    iconColor: 'text-error',
    iconBg: 'bg-error-container',
    value: '68,4%',
    trend: 'Atenção Crítica',
    trendType: 'warning',
    trendText: '',
    subtitle: '1.488 carrinhos sem checkout',
    isCritical: true
  }
];

export const funnelData = [
  {
    id: 1,
    title: '1. Visitas à Loja',
    color: 'bg-primary',
    value: '12.450',
    percentage: '(100%)',
    barColor: 'bg-primary/20',
    barWidth: 'w-full',
    label: 'Tráfego Bruto',
    subvalue: '12.450 sessões',
    dropoff: {
      type: 'normal',
      text: 'Drop-off: 30,0% (3.735 saíram sem ver produtos)',
      icon: 'subdirectory_arrow_right',
      bgClass: 'bg-surface-container-high',
      textClass: 'text-on-surface-variant'
    }
  },
  {
    id: 2,
    title: '2. Visualizações de Produto',
    color: 'bg-secondary',
    value: '8.715',
    percentage: '(70,0% visitas)',
    barColor: 'bg-primary/40',
    barWidth: 'w-[70%]',
    label: 'Engajamento em catálogo',
    subvalue: '8.715',
    dropoff: {
      type: 'critical',
      text: 'Drop-off Crítico: 75,0% (6.537 não adicionaram ao carrinho)',
      icon: 'priority_high',
      bgClass: 'bg-error-container',
      textClass: 'text-on-error-container'
    }
  },
  {
    id: 3,
    title: '3. Adicionados ao Carrinho',
    color: 'bg-primary-container',
    value: '2.178',
    percentage: '(25,0% views)',
    barColor: 'bg-primary-container',
    barWidth: 'w-[25%] min-w-[140px]',
    textClass: 'text-on-primary',
    label: 'Intenção Clara',
    subvalue: '2.178',
    dropoff: {
      type: 'warning',
      text: 'Drop-off: 49,4% (1.076 abandonaram antes do checkout)',
      icon: 'trending_down',
      bgClass: 'bg-secondary-container',
      textClass: 'text-on-secondary-container'
    }
  },
  {
    id: 4,
    title: '4. Checkout Iniciado',
    color: 'bg-secondary-fixed-dim',
    value: '1.102',
    percentage: '(50,6% carrinhos)',
    barColor: 'bg-secondary',
    barWidth: 'w-[13%] min-w-[110px]',
    textClass: 'text-on-secondary',
    label: 'Checkout',
    subvalue: '1.102',
    dropoff: {
      type: 'critical',
      text: 'Drop-off: 68,4% não finalizaram pagamento',
      icon: 'shopping_cart_checkout',
      bgClass: 'bg-error-container',
      textClass: 'text-on-error-container'
    }
  },
  {
    id: 5,
    title: '5. Pedidos Concluídos',
    color: 'bg-tertiary',
    value: '348',
    percentage: '(31,6% checkouts)',
    valueColor: 'text-tertiary',
    barColor: 'bg-tertiary',
    barWidth: 'w-[5%] min-w-[80px]',
    textClass: 'text-on-tertiary',
    label: 'Sucesso',
    subvalue: '348'
  }
];

export const productData = [
  {
    id: 'p1',
    name: 'Fone Bluetooth Pro',
    category: 'Eletrônicos',
    categoryColor: 'text-primary',
    icon: 'headphones',
    iconColor: 'text-primary',
    visits: '3.200',
    carts: '850',
    orders: '95',
    conversion: '2,97%',
    revenue: 'R$ 18.050,00',
    status: {
      label: 'Alerta Abandono',
      icon: 'warning',
      bgClass: 'bg-error-container',
      textClass: 'text-on-error-container'
    }
  },
  {
    id: 'p2',
    name: 'Mochila Ergonômica',
    category: 'Acessórios',
    categoryColor: 'text-tertiary',
    icon: 'backpack',
    iconColor: 'text-tertiary',
    visits: '2.400',
    carts: '600',
    orders: '110',
    conversion: '4,58%',
    conversionColor: 'text-tertiary',
    ordersColor: 'text-tertiary',
    revenueColor: 'text-tertiary',
    revenue: 'R$ 19.800,00',
    status: {
      label: 'Top Performance',
      icon: 'stars',
      bgClass: 'bg-surface-container',
      textClass: 'text-tertiary'
    }
  },
  {
    id: 'p3',
    name: 'Camiseta Algodão Egípcio',
    category: 'Vestuário',
    categoryColor: 'text-secondary',
    icon: 'apparel',
    iconColor: 'text-secondary',
    visits: '1.800',
    carts: '420',
    orders: '85',
    conversion: '4,72%',
    conversionColor: 'text-primary',
    revenue: 'R$ 7.225,00',
    status: {
      label: 'Alta Conversão',
      icon: 'trending_up',
      bgClass: 'bg-surface-container-high',
      textClass: 'text-primary'
    }
  },
  {
    id: 'p4',
    name: 'Luminária Smart LED',
    category: 'Casa & Decoração',
    categoryColor: 'text-on-surface-variant',
    icon: 'lightbulb',
    iconColor: 'text-on-surface-variant',
    visits: '1.315',
    carts: '308',
    orders: '58',
    conversion: '4,41%',
    revenue: 'R$ 7.125,00',
    status: {
      label: 'Estável',
      icon: 'check',
      bgClass: 'bg-surface-container-low',
      textClass: 'text-on-surface-variant'
    }
  }
];

export const actionableInsightsData = [
  {
    id: 'insight-1',
    title: 'Gargalo Crítico no Checkout',
    type: 'critical',
    icon: 'error',
    color: 'bg-error',
    textColor: 'text-error',
    description: (
      <>
        <strong>68,4% de abandono de carrinho</strong> ocorre durante o Checkout.{' '}
        <strong>1.076 clientes</strong> adicionaram ao carrinho mas não concluíram.
      </>
    ),
    action: 'Revise frete na página do produto, ative recuperação via WhatsApp/E-mail em 15 min e teste desconto de 5% no PIX.',
    buttonText: 'Configurar Recuperador',
    buttonIcon: 'schedule_send',
    buttonClass: 'bg-primary text-on-primary hover:bg-on-primary-fixed-variant'
  },
  {
    id: 'insight-2',
    title: 'Categoria Destaque: Acessórios',
    type: 'positive',
    icon: 'rocket_launch',
    color: 'bg-tertiary',
    textColor: 'text-tertiary',
    description: (
      <>
        Acessórios possui a maior taxa de conversão (<strong>4,58%</strong>) e gerou{' '}
        <strong>R$ 19.800,00</strong> em receita com apenas 2.400 visitas.
      </>
    ),
    action: 'Aumente o orçamento de tráfego pago para Acessórios e crie kits promocionais (cross-sell com Fone Bluetooth).',
    buttonText: 'Criar Campanha / Kit',
    buttonIcon: 'add_shopping_cart',
    buttonClass: 'bg-tertiary text-on-tertiary hover:bg-tertiary-container'
  }
];
