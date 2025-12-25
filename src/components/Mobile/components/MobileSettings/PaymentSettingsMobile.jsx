import MobileNav from "#components/Mobile/MobileNav";

const PaymentSettingsMobile = ({onBack}) =>{
    return(
        <div>
                  <MobileNav
        title="Configuración"
        onBack={onBack}
        showCancel={false}
      />
            <h2>Pantalla de pago</h2>
        </div>
    );
};
export default PaymentSettingsMobile;