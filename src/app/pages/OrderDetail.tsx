import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { CancelModal } from '../components/orders/CancelModal';
import { Toast } from '../components/orders/Toast';
import { orderService } from '../services/orderService';
import { useCart } from '../hooks/useCart';
import { catalogService } from '../services/catalogService';
export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await orderService.getOrderById(Number(id));
      
      let catalogProducts: any[] = [];
      try {
        const productsResponse = await catalogService.getProducts();
        catalogProducts = productsResponse.results || [];
      } catch (err) {
        console.error('Failed to load catalog products for order', err);
      }

      const mappedOrder = {
        id: data.id.toString(),
        date: data.created_at,
        estimatedDeliveryDate: data.estimated_delivery_date,
        status: data.status.toLowerCase(),
        total: Number(data.total_amount),
        shippingAddress: {
          name: data.user_name || 'Usuario',
          address: data.shipping_address,
          city: '',
          phone: ''
        },
        paymentMethod: data.payment_method || 'Tarjeta',
        items: data.items.map((i: any) => {
          const productData = catalogProducts.find(p => p.id === i.product_id);
          return {
            name: i.product_name,
            quantity: i.quantity,
            price: Number(i.price_at_purchase),
            image: productData?.image || 'package'
          };
        }),
        timeline: data.history.map((h: any) => ({
          status: h.status.toLowerCase(),
          date: h.changed_at,
          done: true
        }))
      };
      setOrder(mappedOrder);
    } catch (e) {
      console.error('Error fetching order detail:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>
            Pedido no encontrado
          </p>
          <Link
            to="/orders"
            className="inline-block mt-4 text-[#2563EB] hover:underline"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Volver a mis pedidos
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shipping = 15.0;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  const handleCancelConfirm = async () => {
    if (order) {
      try {
        await orderService.cancelOrder(Number(order.id));
        setToastMessage('Pedido cancelado correctamente');
        setToastVisible(true);
        await fetchOrder();
      } catch (e: any) {
        setToastMessage(e.message || 'No se pudo cancelar el pedido');
        setToastVisible(true);
      }
    }
    setCancelModalOpen(false);
  };

  const handleReorder = () => {
    order.items.forEach((item: any) => {
      addItem({
        id: Math.floor(Math.random() * 1000000),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: 'Electrónica',
      });
    });
    setToastMessage('Productos agregados al carrito');
    setToastVisible(true);
    setTimeout(() => {
      navigate('/cart');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Back button */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-[#2563EB] hover:underline mb-6"
          style={{ fontSize: '14px', fontWeight: '500' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver a mis pedidos
        </Link>

        {/* Order info card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '700' }}>
                Pedido #{order.id}
              </h1>
              <p className="text-[#6B7280]" style={{ fontSize: '14px' }}>
                {formatDate(order.date)}
              </p>
              {order.status === 'pagado' && (
                <div className="flex items-center gap-2 mt-2 text-[#6B7280]" style={{ fontSize: '14px' }}>
                  {order.paymentMethod === 'Nequi' ? (
                    <>
                      <span className="w-6 h-6 bg-[#2563EB] text-white rounded flex items-center justify-center" style={{ fontSize: '12px', fontWeight: '700' }}>
                        N
                      </span>
                      <span>Nequi</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      <span>{order.paymentMethod || 'Tarjeta'}</span>
                    </>
                  )}
                </div>
              )}
              {order.estimatedDeliveryDate && (
                <p className="mt-2 text-[#2563EB]" style={{ fontSize: '14px', fontWeight: '600' }}>
                  🚚 Entrega estimada: {formatDate(order.estimatedDeliveryDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Products card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-[#111827] mb-4" style={{ fontSize: '16px', fontWeight: '600' }}>
            Productos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left py-3 text-[#6B7280]" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Producto
                  </th>
                  <th className="text-center py-3 text-[#6B7280]" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Cantidad
                  </th>
                  <th className="text-right py-3 text-[#6B7280]" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Precio unit.
                  </th>
                  <th className="text-right py-3 text-[#6B7280]" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-[#E5E7EB]">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image && (item.image.startsWith('http') || item.image.startsWith('/media')) ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span style={{ fontSize: '20px' }}>📦</span>
                          )}
                        </div>
                        <span className="text-[#111827]" style={{ fontSize: '14px' }}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center text-[#6B7280]" style={{ fontSize: '14px' }}>
                      {item.quantity}
                    </td>
                    <td className="py-4 text-right text-[#6B7280]" style={{ fontSize: '14px' }}>
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-4 text-right text-[#111827]" style={{ fontSize: '14px', fontWeight: '600' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b border-[#E5E7EB]">
                  <td colSpan={3} className="py-3 text-right text-[#6B7280]" style={{ fontSize: '14px' }}>
                    Subtotal
                  </td>
                  <td className="py-3 text-right text-[#111827]" style={{ fontSize: '14px' }}>
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b border-[#E5E7EB]">
                  <td colSpan={3} className="py-3 text-right text-[#6B7280]" style={{ fontSize: '14px' }}>
                    Envío
                  </td>
                  <td className="py-3 text-right text-[#111827]" style={{ fontSize: '14px' }}>
                    ${shipping.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b border-[#E5E7EB]">
                  <td colSpan={3} className="py-3 text-right text-[#6B7280]" style={{ fontSize: '14px' }}>
                    Impuestos (19%)
                  </td>
                  <td className="py-3 text-right text-[#111827]" style={{ fontSize: '14px' }}>
                    ${tax.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-3 text-right text-[#111827]" style={{ fontSize: '16px', fontWeight: '700' }}>
                    Total
                  </td>
                  <td className="py-3 text-right text-[#111827]" style={{ fontSize: '16px', fontWeight: '700' }}>
                    ${total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Shipping address card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-[#111827] mb-4" style={{ fontSize: '16px', fontWeight: '600' }}>
            Dirección de envío
          </h2>
          <div className="text-[#6B7280]" style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p style={{ fontWeight: '600', color: '#111827' }}>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {order.status === 'pendiente' && (
            <button
              onClick={() => navigate(`/orders/${order.id}/pay`)}
              className="flex-1 py-3 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              Pagar ahora
            </button>
          )}
          {(order.status === 'pendiente' || order.status === 'en proceso') && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="flex-1 py-3 px-6 rounded-lg bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 transition-colors"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              Cancelar pedido
            </button>
          )}
          {order.status === 'entregado' && (
            <button
              onClick={handleReorder}
              className="flex-1 py-3 px-6 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              Volver a comprar
            </button>
          )}
        </div>
      </div>

      {/* Modals and toasts */}
      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        orderId={order.id}
      />
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        type="success"
      />
    </div>
  );
}
