import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useLanguage } from "@/contexts/LanguageContext";
import { makeDonation } from "@/api/donations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Landmark, Wallet } from "lucide-react";

interface DonationFormProps {
  onSuccess?: () => void;
}

type DonationType = "one-time" | "subscription";
type PaymentMethod = "card" | "bank" | "paypal";

export const DonationForm = ({ onSuccess }: DonationFormProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [donationType, setDonationType] = useState<DonationType>("one-time");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount < 1) {
      toast({
        title: `${t("error")}: ${t("minimumDonationAmount")}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await makeDonation({
        amount,
        paymentMethod,
        donationType,
      });

      toast({
        title: `${t("success")}: ${t("donationSuccess")}`,
      });

      // Reset form
      setAmount(10);
      setPaymentMethod("card");
      setDonationType("one-time");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Force reload the page to update all components
      window.location.reload();
    } catch (error: any) {
      toast({
        title: `${t("error")}: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="amount">{t("donationAmount")}</Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min={1}
              step={1}
              className="pl-7"
              required
            />
          </div>
        </div>

        <div>
          <Label>{t("donationType")}</Label>
          <RadioGroup
            value={donationType}
            onValueChange={(value: string) => setDonationType(value as DonationType)}
            className="mt-2 flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-time" id="one-time" />
              <Label htmlFor="one-time">{t("oneTimeDonation")}</Label>
            </div>
            {/* Uncomment this if you want to add subscription option */}
            {/* <div className="flex items-center space-x-2">
              <RadioGroupItem value="subscription" id="subscription" />
              <Label htmlFor="subscription">{t("subscriptionDonation")}</Label>
            </div> */}
          </RadioGroup>
        </div>

        <div>
          <Label>{t("paymentMethod")}</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)}
            className="mt-2 flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                {t("creditCard")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center">
                <Landmark className="mr-2 h-4 w-4" />
                {t("bankTransfer")}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                {t("paypal")}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button 
        type="submit" 
        className="mt-6 w-full"
        disabled={isLoading}
      >
        {isLoading ? t("processing") : t("donate")}
      </Button>
    </form>
  );
};
