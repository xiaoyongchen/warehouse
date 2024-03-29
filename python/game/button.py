import pygame.font

class Button():
  def __init__(self, ai_settings, screen, msg):
    self.screen = screen
    self.ai_settings = ai_settings
    self.screen_rect = screen.get_rect()

    # 设置按钮属性
    self.width, self.height = 100, 30
    self.button_color = (0, 230, 0)
    self.text_color = (255, 255, 255)
    self.font = pygame.font.SysFont(None, 24)

    self.rect = pygame.Rect(0, 0, self.width, self.height)
    self.rect.center = self.screen_rect.center

    self.pre_msg(msg)

  def pre_msg(self, msg):
    self.msg_image = self.font.render(msg, True, self.text_color, self.button_color)
    self.msg_image_rect = self.msg_image.get_rect()
    self.msg_image_rect.center = self.rect.center

  def draw_button(self):
    # 填充
    self.screen.fill(self.button_color, self.rect)
    # 关联文本组件
    self.screen.blit(self.msg_image, self.msg_image_rect)