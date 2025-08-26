-- CreateTable
CREATE TABLE "backtest_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "initialCash" DOUBLE PRECISION NOT NULL,
    "maxPosition" DOUBLE PRECISION NOT NULL,
    "finalEquity" DOUBLE PRECISION NOT NULL,
    "totalReturn" DOUBLE PRECISION NOT NULL,
    "winRate" DOUBLE PRECISION NOT NULL,
    "maxDrawdown" DOUBLE PRECISION NOT NULL,
    "sharpeRatio" DOUBLE PRECISION NOT NULL,
    "priceData" JSONB NOT NULL,
    "equity" JSONB NOT NULL,
    "dates" JSONB NOT NULL,
    "trades" JSONB NOT NULL,
    "conditions" JSONB NOT NULL,

    CONSTRAINT "backtest_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "backtest_results_userId_idx" ON "backtest_results"("userId");

-- CreateIndex
CREATE INDEX "backtest_results_code_idx" ON "backtest_results"("code");

-- CreateIndex
CREATE INDEX "backtest_results_executedAt_idx" ON "backtest_results"("executedAt");

-- AddForeignKey
ALTER TABLE "backtest_results" ADD CONSTRAINT "backtest_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
