import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../api/api";
import {useNavigate} from "react-router-dom";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "q4MjXjPHAG20v-iOzeqq2";

export default function CheckoutPage() {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const navigate = useNavigate();
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 50_000,
  });

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      /**
       * 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
       * renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
       * @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
       */
      await widgets.setAmount(amount);

      await Promise.all([
        /**
         * 결제창을 렌더링합니다.
         * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
         */
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          // 렌더링하고 싶은 결제 UI의 variantKey
          // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
          // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
          variantKey: "DEFAULT",
        }),
        /**
         * 약관을 렌더링합니다.
         * @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
         */
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  const requestPayment = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/payments/toss", {
        orderId: "ScoR6da5suvaGaef1Nr0D",
        orderName: "토스 티셔츠 외 2건",
        customerName: "김토스",
        customerEmail: "customer123@gmail.com",
        yourSuccessUrl: window.location.origin + "/sandbox/success"
            + window.location.search,
        yourFailUrl: window.location.origin + "/sandbox/fail"
            + window.location.search,
        amount: 50000,
        payType: "CARD", // 필요한 경우 추가
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Toss Payments 호출
      await widgets?.requestPayment({
        orderId: response.data.body.orderId,
        orderName: response.data.body.orderName,
        customerName: response.data.body.customerName,
        customerEmail: response.data.body.customerEmail,
        successUrl: response.data.body.successUrl,
        failUrl: response.data.body.failUrl,
      });

    } catch (error) {
      console.error("결제 요청 실패:", error.response?.data || error.message);
      alert("결제 요청 중 문제가 발생했습니다. 다시 시도해주세요.");
      navigate("/profile");
    }
  }


  return (
      <div className="wrapper w-100">
        <div className="max-w-540 w-100">
          <div id="payment-method" className="w-100" />
          <div id="agreement" className="w-100" />
          <div className="btn-wrapper w-100">
            <button
                className="btn primary w-100"
                onClick={requestPayment}
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
  );
}