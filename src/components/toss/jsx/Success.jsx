import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  async function confirmPayment() {
    // TODO: API를 호출해서 서버에게 paymentKey, orderId, amount를 넘겨주세요. <- 해결?
    try {
      const response = await fetch(
          "http://localhost:8080/api/v1/payments/toss/success", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount
            })
          });


      if (!response.ok) {
        // 서버에서 에러 응답이 온 경우
        const errorData = await response.json();
        console.error("결제 실패:", errorData);
        alert("결제에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      if (response.ok) {
        setIsConfirmed(true);
      }
      alert("결제가 성공적으로 완료되었습니다!");
    } catch (error) {
      console.error("결제 요청 중 에러 발생:", error);
      alert("결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  }
  return (
      <div className="wrapper w-100">
        {isConfirmed ? (
            <div
                className="flex-column align-center confirm-success w-100 max-w-540"
                style={{
                  display: "flex"
                }}
            >
              <img
                  src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
                  width="120"
                  height="120"
              />
              <h2 className="title">결제를 완료했어요</h2>
              <div className="response-section w-100">
                <div className="flex justify-between">
                  <span className="response-label">결제 금액</span>
                  <span id="amount" className="response-text">
                {amount}
              </span>
                </div>
                <div className="flex justify-between">
                  <span className="response-label">주문번호</span>
                  <span id="orderId" className="response-text">
                {orderId}
              </span>
                </div>
                <div className="flex justify-between">
                  <span className="response-label">paymentKey</span>
                  <span id="paymentKey" className="response-text">
                {paymentKey}
              </span>
                </div>
              </div>

              <div className="w-100 button-group">

                <div className="flex" style={{ gap: "16px" }}>
                  <a
                      className="btn w-100"
                      href="http://localhost:3000/sandbox"
                  >
                    다시 테스트하기
                  </a>
                  <a
                      className="btn w-100"
                      href="http://localhost:3000"
                      target="_blank"
                      rel="noopner noreferer"
                  >
                    메인 페이지
                  </a>
                </div>
              </div>
            </div>
        ) : (
            <div className="flex-column align-center confirm-loading w-100 max-w-540">
              <div className="flex-column align-center">
                <img
                    src="https://static.toss.im/lotties/loading-spot-apng.png"
                    width="120"
                    height="120"
                />
                <h2 className="title text-center">결제 요청까지 성공했어요.</h2>
                <h4 className="text-center description">결제 승인하고 완료해보세요.</h4>
              </div>
              <div className="w-100">
                <button className="btn primary w-100" onClick={confirmPayment}>
                  결제 승인하기
                </button>
              </div>
            </div>
        )}
      </div>
  );
}