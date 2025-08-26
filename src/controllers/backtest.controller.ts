import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../app/lib/auth';
import { IBacktestService } from '../interfaces/backtest-service.interface';
import { IBacktestController } from '../interfaces/backtest-controller.interface';
import { BacktestRequest } from '../types/backtest';

export class BacktestController implements IBacktestController {
  constructor(private backtestService: IBacktestService) {}

  /**
   * バックテスト実行
   * POST /api/backtest/run
   */
  async executeBacktest(request: NextRequest): Promise<NextResponse> {
    try {
      // 認証チェック
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: '認証が必要です' },
          { status: 401 }
        );
      }

      // リクエストボディの取得
      const requestData = await request.json() as BacktestRequest;

      // バックテスト実行
      const result = await this.backtestService.executeBacktest(requestData, session.user.id);

      return NextResponse.json(result);
    } catch (error) {
      console.error('Error executing backtest:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'バックテストの実行中にエラーが発生しました' },
        { status: 500 }
      );
    }
  }

  /**
   * バックテスト結果一覧取得
   * GET /api/backtest/list
   */
  async getBacktestList(request: NextRequest): Promise<NextResponse> {
    try {
      // 認証チェック
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: '認証が必要です' },
          { status: 401 }
        );
      }

      // ユーザーのバックテスト結果一覧を取得
      const results = await this.backtestService.getBacktestsByUser(session.user.id);

      return NextResponse.json(results);
    } catch (error) {
      console.error('Error fetching backtest list:', error);
      return NextResponse.json(
        { error: 'バックテスト結果の取得に失敗しました' },
        { status: 500 }
      );
    }
  }

  /**
   * 個別バックテスト結果取得
   * GET /api/backtest/[id]
   */
  async getBacktestById(
    request: NextRequest,
    params: { id: string }
  ): Promise<NextResponse> {
    try {
      // 認証チェック
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: '認証が必要です' },
          { status: 401 }
        );
      }

      // バックテスト結果を取得
      const result = await this.backtestService.getBacktestById(params.id, session.user.id);

      if (!result) {
        return NextResponse.json(
          { error: 'データが見つかりません' },
          { status: 404 }
        );
      }

      return NextResponse.json(result);
    } catch (error) {
      console.error('Error fetching backtest result:', error);
      return NextResponse.json(
        { error: 'バックテスト結果の取得に失敗しました' },
        { status: 500 }
      );
    }
  }

  /**
   * バックテスト結果保存（互換性のため）
   * POST /api/backtest/store
   */
  async storeBacktest(request: NextRequest): Promise<NextResponse> {
    try {
      // 認証チェック
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: '認証が必要です' },
          { status: 401 }
        );
      }

      // リクエストボディの取得
      const data = await request.json();

      // IDパラメータがある場合は取得
      const id = request.nextUrl.searchParams.get('id');

      if (id) {
        // IDが指定されている場合は既存データを取得
        const result = await this.backtestService.getBacktestById(id, session.user.id);

        if (!result) {
          return NextResponse.json(
            { error: 'データが見つかりません' },
            { status: 404 }
          );
        }

        return NextResponse.json({ data: result });
      } else {
        // IDが指定されていない場合は新規保存として処理
        // ただし、現在は /api/backtest/run で自動保存されるため、
        // この処理は一般的には使用されない
        return NextResponse.json({
          error: 'このAPIは廃止予定です。/api/backtest/run をご使用ください'
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Error in store backtest:', error);
      return NextResponse.json(
        { error: 'バックテスト結果の操作に失敗しました' },
        { status: 500 }
      );
    }
  }

  /**
   * バックテスト結果削除
   * DELETE /api/backtest/[id]
   */
  async deleteBacktest(
    request: NextRequest,
    params: { id: string }
  ): Promise<NextResponse> {
    try {
      // 認証チェック
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: '認証が必要です' },
          { status: 401 }
        );
      }

      // バックテスト結果を削除
      await this.backtestService.deleteBacktest(params.id, session.user.id);

      return NextResponse.json({ message: '削除が完了しました' });
    } catch (error) {
      console.error('Error deleting backtest:', error);
      return NextResponse.json(
        { error: 'バックテスト結果の削除に失敗しました' },
        { status: 500 }
      );
    }
  }
}
