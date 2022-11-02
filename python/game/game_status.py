
class GameStatus():
  def __init__(self, ai_settings):
    self.game_active = False
    self.ai_settings = ai_settings
    self.reset_status()
  
  def reset_status(self):
    self.ships_left = self.ai_settings.ship_limit