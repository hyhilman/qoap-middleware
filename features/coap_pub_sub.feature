Feature: COAP pub/sub
  As a COAP developer
  In order to communicate with my "things"
  I want to subscribe and publish to topics

  Scenario: Receiving plain text message
    When client "B" publishes "hello world" to "foobar" via COAP
    Then client "A" should have received "hello world" from "foobar" via COAP

  Scenario: Receiving JSON message
    When client "B" publishes "[42,43]" to "foobar" via COAP
    Then client "A" should have received "[42,43]" from "foobar" via COAP