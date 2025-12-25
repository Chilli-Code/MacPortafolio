import MobileNav from "#components/Mobile/MobileNav";

const LanguageSettingsMobile = ({ onBack }) => {
  return (
    <div>
              <MobileNav
                title="Configuración"
                onBack={onBack}
                showCancel={false}
              />
      <h1>Language Settings</h1>
    </div>
  );
};

export default LanguageSettingsMobile;